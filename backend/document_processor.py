import fitz  # PyMuPDF
import faiss
import numpy as np
import os
import sys
import json
from sentence_transformers import SentenceTransformer
from PIL import Image
import pytesseract
import io
import base64
from typing import List, Dict, Any

class DocumentProcessor:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        """Initialize the document processor with sentence transformer model"""
        self.model = SentenceTransformer(model_name)
        self.dimension = 384  # Dimension for all-MiniLM-L6-v2 model
        self.index = faiss.IndexFlatIP(self.dimension)  # Inner product for similarity
        self.documents = []  # Store document chunks with metadata
        self.document_store_path = "document_store.json"
        self.index_path = "faiss_index.bin"
        
        # Load existing index and documents if they exist
        self.load_existing_data()
    
    def load_existing_data(self):
        """Load existing FAISS index and document store"""
        try:
            if os.path.exists(self.index_path):
                self.index = faiss.read_index(self.index_path)
                print(f"Loaded existing FAISS index with {self.index.ntotal} vectors")
            
            if os.path.exists(self.document_store_path):
                with open(self.document_store_path, 'r', encoding='utf-8') as f:
                    self.documents = json.load(f)
                print(f"Loaded {len(self.documents)} existing document chunks")
        except Exception as e:
            print(f"Error loading existing data: {e}")
            self.index = faiss.IndexFlatIP(self.dimension)
            self.documents = []
    
    def save_data(self):
        """Save FAISS index and document store"""
        try:
            faiss.write_index(self.index, self.index_path)
            with open(self.document_store_path, 'w', encoding='utf-8') as f:
                json.dump(self.documents, f, ensure_ascii=False, indent=2)
            print("Saved FAISS index and document store")
        except Exception as e:
            print(f"Error saving data: {e}")
    
    def extract_text_from_pdf(self, pdf_path: str) -> List[Dict[str, Any]]:
        """Extract text from PDF file"""
        try:
            doc = fitz.open(pdf_path)
            texts = []
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text()
                
                if text.strip():  # Only add non-empty pages
                    texts.append({
                        'text': text.strip(),
                        'page': page_num + 1,
                        'source': os.path.basename(pdf_path),
                        'type': 'pdf'
                    })
            
            doc.close()
            return texts
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return []
    
    def extract_text_from_image(self, image_path: str) -> Dict[str, Any]:
        """Extract text from image using OCR"""
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image)
            
            if text.strip():
                return {
                    'text': text.strip(),
                    'source': os.path.basename(image_path),
                    'type': 'image'
                }
            return None
        except Exception as e:
            print(f"Error extracting text from image: {e}")
            return None
    
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """Split text into overlapping chunks"""
        if len(text) <= chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + chunk_size
            chunk = text[start:end]
            
            # Try to break at sentence boundary
            if end < len(text):
                last_period = chunk.rfind('.')
                last_newline = chunk.rfind('\n')
                break_point = max(last_period, last_newline)
                
                if break_point > start + chunk_size // 2:
                    chunk = text[start:break_point + 1]
                    end = break_point + 1
            
            chunks.append(chunk.strip())
            start = end - overlap
            
            if start >= len(text):
                break
        
        return [chunk for chunk in chunks if chunk.strip()]
    
    def add_document(self, file_path: str) -> bool:
        """Add a document (PDF or image) to the vector store"""
        try:
            file_ext = os.path.splitext(file_path)[1].lower()
            
            if file_ext == '.pdf':
                document_data = self.extract_text_from_pdf(file_path)
            elif file_ext in ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']:
                single_doc = self.extract_text_from_image(file_path)
                document_data = [single_doc] if single_doc else []
            else:
                print(f"Unsupported file type: {file_ext}")
                return False
            
            if not document_data:
                print("No text extracted from document")
                return False
            
            # Process each document section
            new_embeddings = []
            new_documents = []
            
            for doc_data in document_data:
                chunks = self.chunk_text(doc_data['text'])
                
                for i, chunk in enumerate(chunks):
                    # Create embedding
                    embedding = self.model.encode([chunk])[0]
                    new_embeddings.append(embedding)
                    
                    # Store document metadata
                    doc_metadata = {
                        'text': chunk,
                        'source': doc_data['source'],
                        'type': doc_data['type'],
                        'chunk_id': i,
                        'file_path': file_path
                    }
                    
                    if 'page' in doc_data:
                        doc_metadata['page'] = doc_data['page']
                    
                    new_documents.append(doc_metadata)
            
            # Add to FAISS index
            if new_embeddings:
                embeddings_array = np.array(new_embeddings).astype('float32')
                faiss.normalize_L2(embeddings_array)  # Normalize for cosine similarity
                self.index.add(embeddings_array)
                self.documents.extend(new_documents)
                
                # Save updated data
                self.save_data()
                
                print(f"Added {len(new_embeddings)} chunks from {os.path.basename(file_path)}")
                return True
            
            return False
            
        except Exception as e:
            print(f"Error adding document: {e}")
            return False
    
    def search_documents(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search for relevant document chunks"""
        try:
            if self.index.ntotal == 0:
                return []
            
            # Create query embedding
            query_embedding = self.model.encode([query])[0].astype('float32')
            query_embedding = query_embedding.reshape(1, -1)
            faiss.normalize_L2(query_embedding)
            
            # Search in FAISS index
            scores, indices = self.index.search(query_embedding, min(top_k, self.index.ntotal))
            
            results = []
            for score, idx in zip(scores[0], indices[0]):
                if idx >= 0 and idx < len(self.documents):
                    result = self.documents[idx].copy()
                    result['relevance_score'] = float(score)
                    results.append(result)
            
            return results
            
        except Exception as e:
            print(f"Error searching documents: {e}")
            return []
    
    def get_context_for_query(self, query: str, max_context_length: int = 2000) -> str:
        """Get relevant context from documents for a query"""
        relevant_docs = self.search_documents(query, top_k=5)
        
        if not relevant_docs:
            return ""
        
        context_parts = []
        current_length = 0
        
        for doc in relevant_docs:
            text = doc['text']
            source_info = f"[Source: {doc['source']}"
            
            if 'page' in doc:
                source_info += f", Page {doc['page']}"
            source_info += f", Relevance: {doc['relevance_score']:.2f}]"
            
            doc_text = f"{source_info}\n{text}\n"
            
            if current_length + len(doc_text) <= max_context_length:
                context_parts.append(doc_text)
                current_length += len(doc_text)
            else:
                break
        
        return "\n---\n".join(context_parts)

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 2:
        print("Usage: python document_processor.py <command> [args]")
        print("Commands:")
        print("  add <file_path> - Add a document to the vector store")
        print("  search <query> - Search for relevant documents")
        print("  context <query> - Get context for a query")
        return
    
    processor = DocumentProcessor()
    command = sys.argv[1]
    
    if command == "add" and len(sys.argv) == 3:
        file_path = sys.argv[2]
        success = processor.add_document(file_path)
        print(f"Document added: {success}")
    
    elif command == "search" and len(sys.argv) == 3:
        query = sys.argv[2]
        results = processor.search_documents(query)
        print(json.dumps(results, indent=2, ensure_ascii=False))
    
    elif command == "context" and len(sys.argv) == 3:
        query = sys.argv[2]
        context = processor.get_context_for_query(query)
        print(context)
    
    else:
        print("Invalid command or arguments")

if __name__ == "__main__":
    main()