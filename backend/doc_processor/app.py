# Flask server for document processing
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz  # PyMuPDF
import faiss
from sentence_transformers import SentenceTransformer
import numpy as np
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

# Load a pre-trained sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# In-memory storage for document data and FAISS indexes
document_store = {}

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        logging.error(f"Error extracting text from PDF {pdf_path}: {e}")
        return None

def create_faiss_index(text_chunks):
    """Creates a FAISS index from text chunks."""
    try:
        embeddings = model.encode(text_chunks, convert_to_tensor=True)
        embeddings_np = embeddings.cpu().numpy()
        
        index = faiss.IndexFlatL2(embeddings_np.shape[1])
        index.add(embeddings_np)
        
        return index, text_chunks
    except Exception as e:
        logging.error(f"Error creating FAISS index: {e}")
        return None, None

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    """Processes an uploaded PDF, extracts text, and creates a FAISS index."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Save the file temporarily
        upload_folder = 'uploads'
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        
        file_path = os.path.join(upload_folder, file.filename)
        file.save(file_path)
        
        # Extract text
        text = extract_text_from_pdf(file_path)
        if not text:
            return jsonify({'error': 'Could not extract text from PDF'}), 500
            
        # Simple text chunking (by paragraph)
        chunks = [p.strip() for p in text.split('\n') if p.strip()]
        
        # Create FAISS index
        index, indexed_chunks = create_faiss_index(chunks)
        if not index:
            return jsonify({'error': 'Could not create search index'}), 500

        # Store index and chunks
        document_id = file.filename
        document_store[document_id] = {
            'index': index,
            'chunks': indexed_chunks
        }
        
        # Clean up uploaded file
        os.remove(file_path)

        return jsonify({
            'message': 'PDF processed successfully',
            'document_id': document_id,
            'num_chunks': len(indexed_chunks)
        }), 200

    except Exception as e:
        logging.error(f"Error in /process-pdf: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/search', methods=['POST'])
def search_document():
    """Searches for relevant chunks in a processed document."""
    data = request.get_json()
    document_id = data.get('document_id')
    query = data.get('query')
    k = data.get('k', 3) # Number of top results to return

    if not document_id or not query:
        return jsonify({'error': 'document_id and query are required'}), 400

    if document_id not in document_store:
        return jsonify({'error': 'Document not found or not processed'}), 404

    try:
        doc_data = document_store[document_id]
        index = doc_data['index']
        chunks = doc_data['chunks']
        
        # Encode query and search
        query_embedding = model.encode([query], convert_to_tensor=True).cpu().numpy()
        distances, indices = index.search(query_embedding, k)
        
        # Prepare results
        results = [chunks[i] for i in indices[0]]
        
        return jsonify({'results': results}), 200

    except Exception as e:
        logging.error(f"Error in /search: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(port=5001, debug=True)
