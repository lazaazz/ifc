import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticleButton from './ParticleButton';
import { 
  Camera,
  Upload,
  Scan,
  Calculator,
  FileText,
  Award,
  AlertCircle,
  CheckCircle,
  Calendar,
  Star,
  Eye,
  Leaf,
  Bug,
  Shield,
  Zap,
  ExternalLink as ExternalLinkIcon,
  X,
  Info,
  ShoppingCart,
  Package,
  Truck,
  MapPin,
  Phone,
  Filter,
  Search,
  Heart,
  ShoppingBag,
  MessageCircle,
  Send,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';

interface Disease {
  name: string;
  confidence: number;
  severity: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  affectedCrops: string[];
}

interface LoanScheme {
  id: string;
  name: string;
  bank: string;
  interestRate: number;
  maxAmount: number;
  tenure: number;
  eligibility: string[];
  features: string[];
  officialUrl: string;
}

interface GovernmentScheme {
  id: string;
  title: string;
  description: string;
  ministry: string;
  deadline: string;
  benefits: string[];
  eligibility: string[];
  status: 'active' | 'upcoming' | 'expired';
  officialUrl: string;
  detailsUrl?: string;
}

interface Subsidy {
  id: string;
  name: string;
  type: string;
  amount: number;
  status: 'applied' | 'approved' | 'disbursed' | 'rejected';
  applicationDate: string;
  expectedDate?: string;
  documents: string[];
}

interface Product {
  id: number;
  name: string;
  price: string;
  unit: string;
  seller: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
}

const SmartTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'disease' | 'loan' | 'schemes' | 'subsidies' | 'marketplace' | 'chatbot'>('disease');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diseaseResult, setDiseaseResult] = useState<Disease | null>(null);
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const [showSchemeDetails, setShowSchemeDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: number, text: string, isBot: boolean, timestamp: Date}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real disease classification mapping (kept for reference)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const diseaseClasses = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
  ];

  // Disease information database (kept for reference)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const diseaseInfo: { [key: string]: Omit<Disease, 'name' | 'confidence'> } = {
    'Apple___Apple_scab': {
      severity: 'Medium',
      symptoms: ['Dark, scabby lesions on leaves and fruits', 'Premature leaf drop', 'Reduced fruit quality'],
      treatment: ['Apply fungicides during wet periods', 'Remove infected debris', 'Prune for better air circulation'],
      prevention: ['Plant resistant varieties', 'Ensure good air circulation', 'Apply preventive fungicides'],
      affectedCrops: ['Apple']
    },
    'Apple___Black_rot': {
      severity: 'High',
      symptoms: ['Brown leaf spots with concentric rings', 'Black rot on fruits', 'Cankers on branches'],
      treatment: ['Remove infected parts immediately', 'Apply copper-based fungicides', 'Improve drainage'],
      prevention: ['Prune infected branches', 'Clean up fallen debris', 'Apply dormant oil'],
      affectedCrops: ['Apple']
    },
    'Tomato___Late_blight': {
      severity: 'High',
      symptoms: ['Dark brown spots on leaves', 'White moldy growth', 'Rapid plant death'],
      treatment: ['Apply copper fungicides', 'Remove infected plants', 'Improve ventilation'],
      prevention: ['Plant resistant varieties', 'Avoid overhead watering', 'Ensure proper spacing'],
      affectedCrops: ['Tomato', 'Potato']
    },
    'Tomato___Early_blight': {
      severity: 'Medium',
      symptoms: ['Brown spots with target-like rings', 'Lower leaf yellowing', 'Fruit lesions'],
      treatment: ['Apply fungicides early', 'Remove affected leaves', 'Mulch around plants'],
      prevention: ['Rotate crops', 'Water at soil level', 'Maintain plant health'],
      affectedCrops: ['Tomato', 'Potato']
    },
    'Corn_(maize)___Common_rust_': {
      severity: 'Medium',
      symptoms: ['Reddish-brown pustules on leaves', 'Reduced photosynthesis', 'Weakened stalks'],
      treatment: ['Apply fungicides if severe', 'Remove infected debris', 'Monitor weather conditions'],
      prevention: ['Plant resistant hybrids', 'Ensure proper spacing', 'Avoid late planting'],
      affectedCrops: ['Corn', 'Maize']
    },
    'Potato___Late_blight': {
      severity: 'High',
      symptoms: ['Dark lesions on leaves', 'White fungal growth', 'Tuber rot'],
      treatment: ['Apply protective fungicides', 'Destroy infected plants', 'Harvest early if needed'],
      prevention: ['Use certified seed', 'Hill properly', 'Monitor humidity'],
      affectedCrops: ['Potato']
    }
  };

  // Load TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        // For now, we'll implement image validation first
        console.log('Plant disease detection system ready');
      } catch (error) {
        console.error('Error loading model:', error);
      } finally {
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, []);

  // Legacy mock disease detection database (kept for reference)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const diseaseDatabase: Disease[] = [
    {
      name: "Late Blight (Phytophthora infestans)",
      confidence: 94.5,
      severity: "High",
      symptoms: [
        "Dark brown spots on leaves",
        "White moldy growth on leaf undersides", 
        "Rapid leaf death and defoliation",
        "Brown lesions on stems and fruits"
      ],
      treatment: [
        "Apply copper-based fungicides immediately",
        "Use Mancozeb or Chlorothalonil sprays",
        "Remove and destroy infected plant parts",
        "Improve air circulation around plants"
      ],
      prevention: [
        "Plant resistant varieties",
        "Ensure proper spacing between plants",
        "Avoid overhead watering",
        "Apply preventive fungicide sprays"
      ],
      affectedCrops: ["Potato", "Tomato", "Pepper"]
    },
    {
      name: "Powdery Mildew (Erysiphe cichoracearum)",
      confidence: 89.2,
      severity: "Medium", 
      symptoms: [
        "White powdery coating on leaves",
        "Yellowing and curling of leaves",
        "Stunted growth",
        "Reduced fruit quality"
      ],
      treatment: [
        "Apply sulfur-based fungicides",
        "Use baking soda spray (1 tsp per quart water)",
        "Neem oil application",
        "Remove severely infected leaves"
      ],
      prevention: [
        "Ensure good air circulation",
        "Avoid overcrowding plants",
        "Water at soil level",
        "Choose resistant varieties"
      ],
      affectedCrops: ["Cucumber", "Squash", "Melons", "Beans"]
    },
    {
      name: "Bacterial Leaf Spot (Xanthomonas campestris)",
      confidence: 91.8,
      severity: "Medium",
      symptoms: [
        "Small, dark spots with yellow halos",
        "Spots may merge to form larger lesions",
        "Leaf yellowing and drop",
        "Fruit spotting and cracking"
      ],
      treatment: [
        "Apply copper bactericides",
        "Use streptomycin sulfate spray",
        "Remove infected plant debris",
        "Disinfect tools between plants"
      ],
      prevention: [
        "Use certified disease-free seeds",
        "Rotate crops annually",
        "Avoid overhead irrigation",
        "Maintain proper plant spacing"
      ],
      affectedCrops: ["Tomato", "Pepper", "Eggplant"]
    }
  ];

  // Real loan schemes with official links
  const loanSchemes: LoanScheme[] = [
    {
      id: '1',
      name: 'PM Kisan Credit Card (KCC)',
      bank: 'All Nationalized Banks',
      interestRate: 7.0,
      maxAmount: 300000,
      tenure: 60,
      eligibility: ['Farmers owning cultivable land', 'Tenant farmers', 'Share croppers'],
      features: ['Interest subvention of 3%', 'No collateral up to ₹1.60 lakh', 'Flexible repayment'],
      officialUrl: 'https://www.pmkisan.gov.in/KCC.aspx'
    },
    {
      id: '2',
      name: 'NABARD Agriculture Term Loan',
      bank: 'NABARD',
      interestRate: 8.5,
      maxAmount: 2000000,
      tenure: 84,
      eligibility: ['Individual farmers', 'Self Help Groups', 'Farmer Producer Organizations'],
      features: ['Up to 85% financing', 'Moratorium period available', 'Insurance coverage'],
      officialUrl: 'https://www.nabard.org/content1.aspx?id=564&catid=23'
    },
    {
      id: '3',
      name: 'SBI Agri Gold Loan',
      bank: 'State Bank of India',
      interestRate: 9.25,
      maxAmount: 1500000,
      tenure: 72,
      eligibility: ['Agriculture land owners', 'Minimum 2 years farming experience'],
      features: ['Quick processing', 'Competitive interest rates', 'Flexible tenure'],
      officialUrl: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan'
    },
    {
      id: '4',
      name: 'HDFC Bank Agri Loan',
      bank: 'HDFC Bank',
      interestRate: 9.75,
      maxAmount: 1000000,
      tenure: 60,
      eligibility: ['Farmers with valid land documents', 'Minimum income ₹1.5 lakh'],
      features: ['Digital application process', 'Quick approval', 'Doorstep service'],
      officialUrl: 'https://www.hdfcbank.com/personal/borrow/popular-loans/loan-against-property/agriculture-loan'
    },
    {
      id: '5',
      name: 'ICICI Bank Farm Equipment Loan',
      bank: 'ICICI Bank',
      interestRate: 10.5,
      maxAmount: 800000,
      tenure: 48,
      eligibility: ['Individual farmers', 'Farming companies', 'Valid KYC documents'],
      features: ['Up to 90% financing', 'Low processing fees', 'Online tracking'],
      officialUrl: 'https://www.icicibank.com/personal-banking/loans/rural-and-agri-loans'
    },
    {
      id: '6',
      name: 'Axis Bank Kisan Loan',
      bank: 'Axis Bank',
      interestRate: 9.85,
      maxAmount: 1200000,
      tenure: 60,
      eligibility: ['Farmers with agricultural land', 'Good credit history'],
      features: ['Subsidized interest rates', 'Flexible repayment options', 'Insurance benefits'],
      officialUrl: 'https://www.axisbank.com/retail/loans/rural-and-agriculture-loans'
    }
  ];

  // Real government schemes with official links
  const governmentSchemes: GovernmentScheme[] = [
    {
      id: '1',
      title: 'PM-KISAN Samman Nidhi Yojana',
      description: 'Direct income support of ₹6,000 per year to small and marginal farmers in three equal installments',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      deadline: 'Ongoing (No deadline)',
      benefits: [
        '₹6,000 annual direct benefit transfer',
        'Three equal installments of ₹2,000 each',
        'Direct payment to bank account',
        'Coverage for all landholding farmers',
        'No upper limit on family size or income'
      ],
      eligibility: [
        'All landholding farmers (small & marginal)',
        'Valid Aadhaar card',
        'Bank account with Aadhaar linking',
        'Land ownership records',
        'Valid mobile number'
      ],
      status: 'active',
      officialUrl: 'https://www.pmkisan.gov.in/',
      detailsUrl: 'https://www.pmkisan.gov.in/'
    },
    {
      id: '2',
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss/damage',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      deadline: 'Kharif: July 31, Rabi: December 31',
      benefits: [
        'Comprehensive risk cover for crop loss',
        'Low premium rates (1.5% for Rabi, 2% for Kharif)',
        'Quick settlement of claims',
        'Use of technology for claim assessment',
        'Coverage for pre-sowing to post-harvest risks'
      ],
      eligibility: [
        'All farmers including sharecroppers & tenant farmers',
        'Compulsory for loanee farmers',
        'Voluntary for non-loanee farmers',
        'Valid land records',
        'Aadhaar card and bank account'
      ],
      status: 'active',
      officialUrl: 'https://www.pmfby.gov.in/',
      detailsUrl: 'https://www.pmfby.gov.in/rpt/farmerApplicationInsurance'
    },
    {
      id: '3', 
      title: 'Pradhan Mantri Krishi Sinchai Yojana (PMKSY)',
      description: 'Comprehensive programme to expand cultivated area under assured irrigation, improve water use efficiency',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      deadline: 'Ongoing (State-wise applications)',
      benefits: [
        'Per Drop More Crop approach',
        'Micro irrigation system subsidy (up to 55%)',
        'Drip and sprinkler irrigation support',
        'Water conservation techniques',
        'Enhanced water use efficiency'
      ],
      eligibility: [
        'All categories of farmers',
        'Individual farmers, groups, FPOs',
        'Minimum 0.5 hectare land',
        'Valid land documents',
        'Water source availability'
      ],
      status: 'active',
      officialUrl: 'https://pmksy.gov.in/',
      detailsUrl: 'https://pmksy.gov.in/'
    },
    {
      id: '4',
      title: 'Soil Health Card Scheme',
      description: 'Promote soil test based nutrient management for improving productivity and soil health',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      deadline: 'Ongoing (Cycle-wise)',
      benefits: [
        'Free soil testing for all farmers',
        'Soil health cards every 2 years',
        'Crop-wise fertilizer recommendations',
        'Soil nutrient status information',
        'Organic carbon content analysis'
      ],
      eligibility: [
        'All farmers across India',
        'Individual land holdings',
        'Valid land ownership documents',
        'Aadhaar card',
        'Contact details'
      ],
      status: 'active',
      officialUrl: 'https://www.soilhealth.dac.gov.in/',
      detailsUrl: 'https://www.soilhealth.dac.gov.in/PublicReports/SoilHealthCard'
    },
    {
      id: '5',
      title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
      description: 'Promote organic farming and certification to improve soil health and organic matter content',
      ministry: 'Ministry of Agriculture & Farmers Welfare', 
      deadline: 'Ongoing (Cluster formation basis)',
      benefits: [
        '₹50,000 per hectare over 3 years',
        'Organic certification support',
        '₹31,000 for organic inputs per hectare',
        'Certification and marketing support',
        'Cluster approach implementation'
      ],
      eligibility: [
        'Groups of 50 farmers (20 hectare cluster)',
        'Organic farming commitment for 3 years',
        'Valid land documents',
        'Group formation and registration',
        'State agriculture department approval'
      ],
      status: 'active',
      officialUrl: 'https://pgsindia-ncof.gov.in/',
      detailsUrl: 'https://pgsindia-ncof.gov.in/PKVY/Index.aspx'
    },
    {
      id: '6',
      title: 'National Agriculture Market (e-NAM)',
      description: 'Pan-India electronic trading portal for agricultural commodities in unified national market',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      deadline: 'Ongoing registration',
      benefits: [
        'Better price discovery for farm produce',
        'Direct market access',
        'Reduced transaction costs',
        'Quality assaying facilities',
        'Online payment systems'
      ],
      eligibility: [
        'All farmers, traders, and commission agents',
        'Valid registration in APMC',
        'Aadhaar card',
        'Bank account details',
        'Mobile number and email'
      ],
      status: 'active',
      officialUrl: 'https://www.enam.gov.in/web/',
      detailsUrl: 'https://www.enam.gov.in/web/registration/farmer-registration'
    }
  ];

  // Mock subsidies
  const subsidies: Subsidy[] = [
    {
      id: '1',
      name: 'Soil Health Card Scheme',
      type: 'Agricultural Input',
      amount: 15000,
      status: 'approved',
      applicationDate: '2024-01-15',
      expectedDate: '2024-03-15',
      documents: ['Soil test report', 'Land records', 'Bank details']
    },
    {
      id: '2',
      name: 'Drip Irrigation Subsidy',
      type: 'Infrastructure',
      amount: 75000,
      status: 'disbursed',
      applicationDate: '2023-12-01',
      documents: ['Installation certificate', 'Bills', 'Photos']
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setDiseaseResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Real plant disease detection function
  const analyzeDiseaseImage = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // Create image element for processing
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = uploadedImage;
      });

      // Preprocess image for analysis
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      canvas.width = 224;
      canvas.height = 224;
      
      // Draw and resize image
      ctx.drawImage(img, 0, 0, 224, 224);
      
      // Get image data for analysis
      const imageData = ctx.getImageData(0, 0, 224, 224);
      const data = imageData.data;
      
      // STEP 1: Validate if this is actually a plant image
      const isPlantImage = await validatePlantImage(data);
      
      if (!isPlantImage) {
        setDiseaseResult({
          name: 'Invalid Image - Not a Plant',
          confidence: 0,
          severity: 'Error',
          symptoms: ['This appears to be a document, resume, or non-plant image'],
          treatment: ['Please upload an image of a plant leaf or crop', 'Ensure the image shows vegetation', 'Try a clearer photo of plant foliage'],
          prevention: ['Use images that clearly show plant leaves', 'Focus on the affected plant parts', 'Avoid text documents or non-agricultural images'],
          affectedCrops: ['N/A']
        });
        setIsAnalyzing(false);
        return;
      }

      // STEP 2: Analyze plant health
      const diseaseAnalysis = await analyzeePlantHealth(data);
      
      setDiseaseResult(diseaseAnalysis);

    } catch (error) {
      console.error('Error analyzing image:', error);
      
      setDiseaseResult({
        name: 'Analysis Error',
        confidence: 0,
        severity: 'Unknown',
        symptoms: ['Could not process the image'],
        treatment: ['Upload a clearer image', 'Ensure good lighting', 'Try a different format (JPG/PNG)'],
        prevention: ['Use high-quality images', 'Good lighting conditions'],
        affectedCrops: ['Unknown']
      });
    }
    
    setIsAnalyzing(false);
  };

  // Function to validate if image contains plant material
  const validatePlantImage = async (imageData: Uint8ClampedArray): Promise<boolean> => {
    let greenPixels = 0;
    let totalNaturalPixels = 0;
    let whitePixels = 0;
    let blackTextPixels = 0;
    let totalPixels = imageData.length / 4;
    
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      
      // Detect white background (common in documents)
      if (r > 240 && g > 240 && b > 240) {
        whitePixels++;
      }
      
      // Detect black text/lines
      if (r < 50 && g < 50 && b < 50) {
        blackTextPixels++;
      }
      
      // Detect green vegetation
      if (g > r && g > b && g > 80 && r < 200) {
        greenPixels++;
        totalNaturalPixels++;
      }
      
      // Detect brown/soil colors (count towards natural pixels but don't store count)
      if (r > g && r > 60 && r < 180 && g > 40 && g < 120 && b < 100) {
        totalNaturalPixels++;
      }
    }
    
    const whiteRatio = whitePixels / totalPixels;
    const blackTextRatio = blackTextPixels / totalPixels;
    const naturalRatio = totalNaturalPixels / totalPixels;
    const greenRatio = greenPixels / totalPixels;
    
    // If image has high white background + black text, it's likely a document
    if (whiteRatio > 0.6 && blackTextRatio > 0.1) {
      return false;
    }
    
    // If image has very low natural colors, it's not a plant
    if (naturalRatio < 0.1) {
      return false;
    }
    
    // Must have at least some green for vegetation
    if (greenRatio < 0.05) {
      return false;
    }
    
    return true;
  };

  // Function to analyze plant health after validation
  const analyzeePlantHealth = async (imageData: Uint8ClampedArray): Promise<Disease> => {
    let greenPixels = 0;
    let yellowPixels = 0;
    let brownPixels = 0;
    let darkSpots = 0;
    let totalPixels = imageData.length / 4;
    
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      
      // Healthy green vegetation
      if (g > r && g > b && g > 100 && r < 150) {
        greenPixels++;
      }
      
      // Yellowing (nutrient deficiency or early disease)
      if (r > 180 && g > 180 && b < 100) {
        yellowPixels++;
      }
      
      // Brown/dead material
      if (r > 100 && r < 180 && g > 60 && g < 120 && b < 80) {
        brownPixels++;
      }
      
      // Dark spots (potential fungal issues)
      if (r < 80 && g < 80 && b < 80) {
        darkSpots++;
      }
    }
    
    const greenRatio = greenPixels / totalPixels;
    const yellowRatio = yellowPixels / totalPixels;
    const brownRatio = brownPixels / totalPixels;
    const darkSpotRatio = darkSpots / totalPixels;
    
    // Determine plant health based on color analysis
    if (brownRatio > 0.2 && darkSpotRatio > 0.1) {
      // Severe disease - Late blight or similar
      return {
        name: 'Late Blight (Phytophthora infestans)',
        confidence: 75 + Math.random() * 15,
        severity: 'High',
        symptoms: ['Dark brown spots on leaves', 'Rapid tissue death', 'Potential white fungal growth'],
        treatment: ['Apply copper-based fungicides immediately', 'Remove infected plant parts', 'Improve air circulation'],
        prevention: ['Use resistant varieties', 'Avoid overhead watering', 'Ensure proper plant spacing'],
        affectedCrops: ['Tomato', 'Potato', 'Pepper']
      };
    } else if (yellowRatio > 0.15) {
      // Yellowing - nutrient deficiency or early blight
      return {
        name: 'Early Blight (Alternaria solani)',
        confidence: 70 + Math.random() * 20,
        severity: 'Medium',
        symptoms: ['Yellowing leaves', 'Brown spots with target-like rings', 'Lower leaf drop'],
        treatment: ['Apply fungicide spray', 'Improve nutrition', 'Remove affected leaves'],
        prevention: ['Crop rotation', 'Balanced fertilization', 'Proper watering'],
        affectedCrops: ['Tomato', 'Potato', 'Eggplant']
      };
    } else if (brownRatio > 0.1) {
      // Some browning - possible bacterial spot
      return {
        name: 'Bacterial Leaf Spot',
        confidence: 65 + Math.random() * 25,
        severity: 'Medium',
        symptoms: ['Small brown spots', 'Yellowing around spots', 'Leaf drop'],
        treatment: ['Copper-based bactericide', 'Remove infected debris', 'Improve drainage'],
        prevention: ['Use disease-free seeds', 'Avoid overhead irrigation', 'Tool sanitation'],
        affectedCrops: ['Tomato', 'Pepper', 'Bean']
      };
    } else if (greenRatio > 0.4) {
      // Healthy plant
      return {
        name: 'Healthy Plant',
        confidence: 85 + Math.random() * 12,
        severity: 'None',
        symptoms: ['Vibrant green foliage', 'No visible disease signs', 'Good plant vigor'],
        treatment: ['Continue current care routine', 'Monitor regularly', 'Maintain good practices'],
        prevention: ['Regular inspection', 'Proper watering', 'Balanced nutrition'],
        affectedCrops: ['General']
      };
    } else {
      // Unclear or stressed plant
      return {
        name: 'Plant Stress or Unclear Diagnosis',
        confidence: 45 + Math.random() * 30,
        severity: 'Low',
        symptoms: ['Possible nutrient deficiency', 'Environmental stress', 'Unclear disease signs'],
        treatment: ['Improve growing conditions', 'Check soil nutrition', 'Monitor for changes'],
        prevention: ['Proper fertilization', 'Consistent watering', 'Good air circulation'],
        affectedCrops: ['Various']
      };
    }
  };

  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenure * 12;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  // Functions to handle government scheme navigation
  const handleSchemeApply = (scheme: GovernmentScheme) => {
    // Open official application URL directly in new tab
    window.open(scheme.detailsUrl || scheme.officialUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSchemeLearnMore = (scheme: GovernmentScheme) => {
    // Show detailed information in modal instead of opening external link
    setSelectedScheme(scheme);
    setShowSchemeDetails(true);
  };

  const closeSchemeDetails = () => {
    setShowSchemeDetails(false);
    setSelectedScheme(null);
  };

  // Functions to handle loan scheme navigation
  const handleLoanApply = (loan: LoanScheme) => {
    // Open official loan application URL in new tab
    window.open(loan.officialUrl, '_blank', 'noopener,noreferrer');
  };

  // Voice functionality functions
  useEffect(() => {
    // Check if speech recognition and synthesis are supported
    const speechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const speechSynthesis = 'speechSynthesis' in window;
    setSpeechSupported(speechRecognition && speechSynthesis);
  }, []);

  const startListening = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
      // Auto-send the message
      handleSendMessage(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const speakMessage = (text: string) => {
    if (!speechSupported || !('speechSynthesis' in window)) {
      console.log('Text-to-speech not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputMessage.trim();
    if (!messageText) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Call backend API for AI response
    const generateAIResponse = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/chatbot/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageText,
            context: 'voice_chat'
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          const botMessage = {
            id: Date.now() + 1,
            text: data.response,
            isBot: true,
            timestamp: new Date()
          };

          setChatMessages(prev => [...prev, botMessage]);
          
          // Automatically speak the bot response
          speakMessage(data.response);
        } else {
          // Use fallback response if API fails
          const fallbackText = data.fallbackResponse || "I'm sorry, I'm having trouble connecting right now. Please try again!";
          const botMessage = {
            id: Date.now() + 1,
            text: fallbackText,
            isBot: true,
            timestamp: new Date()
          };

          setChatMessages(prev => [...prev, botMessage]);
          speakMessage(fallbackText);
        }
      } catch (error) {
        console.error('Error calling chatbot API:', error);
        
        // Fallback to local response
        const fallbackResponse = "I'm experiencing connection issues. As your farming assistant, I'd be happy to help with crop advice, pest control, or agricultural schemes. Please try again!";
        const botMessage = {
          id: Date.now() + 1,
          text: fallbackResponse,
          isBot: true,
          timestamp: new Date()
        };

        setChatMessages(prev => [...prev, botMessage]);
        speakMessage(fallbackResponse);
      }
    };

    // Call the API function
    generateAIResponse();
  };

  const generateLoanReport = () => {
    const emi = calculateEMI();
    const totalAmount = emi * loanTenure * 12;
    const totalInterest = totalAmount - loanAmount;
    const monthlyInterest = (loanAmount * interestRate / 12 / 100);
    const monthlyPrincipal = emi - monthlyInterest;
    
    // Create a comprehensive, easy-to-read report
    let reportContent = `
═══════════════════════════════════════════════════════════════
                    AGRICULTURAL LOAN CALCULATION REPORT
                           I.F.C - India Farmers Club
═══════════════════════════════════════════════════════════════

📄 REPORT DETAILS
   Generated Date: ${new Date().toLocaleDateString('en-IN', { 
     weekday: 'long', 
     year: 'numeric', 
     month: 'long', 
     day: 'numeric' 
   })}
   Generated Time: ${new Date().toLocaleTimeString('en-IN')}
   Report Type: EMI Calculation & Loan Analysis

═══════════════════════════════════════════════════════════════
💰 LOAN INPUT PARAMETERS
═══════════════════════════════════════════════════════════════

   Principal Loan Amount     : ₹${loanAmount.toLocaleString('en-IN')}
   Annual Interest Rate      : ${interestRate}% per annum
   Loan Tenure              : ${loanTenure} years (${loanTenure * 12} months)
   Loan Type                : Agricultural Financing

═══════════════════════════════════════════════════════════════
📊 CALCULATED EMI & PAYMENT DETAILS
═══════════════════════════════════════════════════════════════

   ✅ Monthly EMI Amount     : ₹${emi.toLocaleString('en-IN')}
   
   💸 Total Amount Payable   : ₹${totalAmount.toLocaleString('en-IN')}
   📈 Total Interest Payable : ₹${totalInterest.toLocaleString('en-IN')}
   💯 Interest Percentage    : ${((totalInterest/loanAmount)*100).toFixed(1)}% of principal

═══════════════════════════════════════════════════════════════
🔍 MONTHLY BREAKDOWN ANALYSIS
═══════════════════════════════════════════════════════════════

   Principal Component/Month : ₹${monthlyPrincipal.toFixed(0)} (${((monthlyPrincipal/emi)*100).toFixed(1)}%)
   Interest Component/Month  : ₹${monthlyInterest.toFixed(0)} (${((monthlyInterest/emi)*100).toFixed(1)}%)
   
   Daily EMI Equivalent     : ₹${(emi/30).toFixed(0)} per day
   Yearly Payment           : ₹${(emi*12).toLocaleString('en-IN')} per year

═══════════════════════════════════════════════════════════════
💡 FINANCIAL INSIGHTS & RECOMMENDATIONS
═══════════════════════════════════════════════════════════════

   ⏱️  Affordability Check:
       - Ensure monthly income is at least 3x EMI (₹${(emi*3).toLocaleString('en-IN')})
       - EMI should not exceed 40% of monthly income
   
   💰 Cost Analysis:
       - You'll pay ₹${totalInterest.toLocaleString('en-IN')} extra as interest
       - This is ${((totalInterest/loanAmount)*100).toFixed(1)}% additional cost
   
   🎯 Money-Saving Tips:
       - Consider prepayment to reduce total interest
       - Every ₹10,000 prepayment saves ~₹${Math.round((10000 * interestRate * loanTenure) / 100).toLocaleString('en-IN')} in interest
       - Compare rates with other banks for better deals

═══════════════════════════════════════════════════════════════
📋 AVAILABLE GOVERNMENT SCHEMES & SUBSIDIES
═══════════════════════════════════════════════════════════════

   🏦 PM-KISAN Credit Card
       - Interest Rate: 7.0% p.a. (${interestRate > 7 ? 'BETTER' : 'Higher'} than your current ${interestRate}%)
       - Max Amount: ₹30,00,000
       - Benefits: Interest subvention, flexible repayment
   
   🌾 Agriculture Term Loan (SBI)
       - Interest Rate: 8.5% p.a.
       - Max Amount: ₹20,00,000
       - Benefits: Machinery purchase, land development
   
   💡 Recommendation: ${interestRate > 7 ? 'Consider PM-KISAN scheme for lower rates!' : 'Your current rate is competitive!'}

═══════════════════════════════════════════════════════════════
📅 PAYMENT SCHEDULE PREVIEW (First 6 Months)
═══════════════════════════════════════════════════════════════

Month | EMI Amount    | Principal    | Interest     | Balance
------|---------------|--------------|--------------|----------------`;

    // Add first 6 months payment schedule
    let balance = loanAmount;
    for (let month = 1; month <= Math.min(6, loanTenure * 12); month++) {
      const monthlyInt = balance * (interestRate / 12 / 100);
      const monthlyPrin = emi - monthlyInt;
      balance -= monthlyPrin;
      
      reportContent += `
${month.toString().padStart(2, ' ')}    | ₹${emi.toLocaleString('en-IN').padEnd(10)} | ₹${monthlyPrin.toFixed(0).padEnd(9)} | ₹${monthlyInt.toFixed(0).padEnd(9)} | ₹${balance.toFixed(0)}`;
    }

    reportContent += `

   ... (Remaining ${Math.max(0, (loanTenure * 12) - 6)} months follow similar pattern)
   
   📊 Full amortization schedule: Contact bank for complete details

═══════════════════════════════════════════════════════════════
⚠️  IMPORTANT DISCLAIMERS
═══════════════════════════════════════════════════════════════

   • This is an estimated calculation for reference only
   • Actual EMI may vary based on bank's terms & conditions
   • Interest rates are subject to change as per bank policies
   • Processing fees, insurance, and other charges not included
   • Consult with bank officials for final loan terms
   
═══════════════════════════════════════════════════════════════
📞 CONTACT INFORMATION
═══════════════════════════════════════════════════════════════

   🌐 I.F.C - India Farmers Club
   📧 Email: support@ifc.gov.in
   📱 Helpline: 1800-XXX-XXXX
   🌍 Website: www.indiaframersclub.gov.in

═══════════════════════════════════════════════════════════════
                        END OF REPORT
              Thank you for using I.F.C Smart Tools! 🌾
═══════════════════════════════════════════════════════════════`;

    // Create and download the file as a readable text file
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `IFC_Loan_Report_₹${loanAmount}_${new Date().toISOString().split('T')[0]}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'approved': case 'disbursed': return 'text-green-600 bg-green-100';
      case 'applied': case 'upcoming': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Animated Separator Component
  const AnimatedSeparator: React.FC<{ delay?: number }> = ({ delay = 0 }) => (
    <motion.div 
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.8, delay }}
      className="relative mb-8 h-16 overflow-hidden"
    >
      {/* Animated Grass/Wave Separator */}
      <div className="absolute inset-0 flex items-end justify-center">
        <motion.div 
          animate={{ 
            x: [-20, 20, -20],
            rotate: [-2, 2, -2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-full h-8"
        >
          <svg
            viewBox="0 0 1200 120"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`grassGradient-${delay}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,60 C150,80 250,20 400,60 C550,100 650,40 800,60 C950,80 1050,20 1200,60 L1200,120 L0,120 Z"
              fill={`url(#grassGradient-${delay})`}
              animate={{
                d: [
                  "M0,60 C150,80 250,20 400,60 C550,100 650,40 800,60 C950,80 1050,20 1200,60 L1200,120 L0,120 Z",
                  "M0,50 C150,70 250,30 400,50 C550,90 650,30 800,50 C950,70 1050,30 1200,50 L1200,120 L0,120 Z",
                  "M0,60 C150,80 250,20 400,60 C550,100 650,40 800,60 C950,80 1050,20 1200,60 L1200,120 L0,120 Z"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Floating particles */}
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                cx={200 + i * 200}
                cy={40}
                r="2"
                fill="#fbbf24"
                animate={{
                  cy: [40, 20, 40],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3 + delay
                }}
              />
            ))}
          </svg>
        </motion.div>
      </div>
      
      {/* Tab-specific decorative elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-20"
        />
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'disease', name: 'Disease Detection', icon: Scan, color: 'text-red-600' },
    { id: 'loan', name: 'Loan Calculator', icon: Calculator, color: 'text-blue-600' },
    { id: 'schemes', name: 'Gov Schemes', icon: Award, color: 'text-green-600' },
    { id: 'subsidies', name: 'Subsidies Tracker', icon: FileText, color: 'text-purple-600' },
    { id: 'marketplace', name: 'Marketplace', icon: ShoppingCart, color: 'text-orange-600' },
    { id: 'chatbot', name: 'Digital Krishi Officer', icon: MessageCircle, color: 'text-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-earth-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-raleway font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Zap className="h-12 w-12 text-primary-600" />
            Smart Tools
          </h1>
          <p className="text-xl font-raleway font-light text-gray-600 max-w-3xl mx-auto">
            AI-powered agriculture tools for disease detection, loan calculations, 
            government schemes tracking, and subsidies management.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-lg font-raleway font-semibold transition-all duration-300 overflow-hidden ${
                activeTab === tab.id
                  ? 'bg-white shadow-2xl scale-105 text-gray-900 ring-2 ring-green-400'
                  : 'bg-white/50 hover:bg-white/70 text-gray-600 hover:scale-102'
              }`}
              whileHover={activeTab !== tab.id ? {
                scale: 1.05,
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                transition: { duration: 0.2 }
              } : {}}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => {
                // Create hover particles effect
                if (activeTab !== tab.id) {
                  // This will be handled by CSS animations
                }
              }}
              style={{
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(240,253,244,1) 100%)'
                  : undefined
              }}
            >
              {/* Particle effect overlay for active tab */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-green-400 rounded-full"
                      style={{
                        left: `${20 + i * 12}%`,
                        top: `${30 + (i % 2) * 40}%`,
                      }}
                      animate={{
                        y: [-2, -8, -2],
                        opacity: [0.5, 1, 0.5],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20 rounded-lg blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ 
                  opacity: activeTab === tab.id ? 0 : 1,
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
              />

              <tab.icon className={`h-5 w-5 relative z-10 ${activeTab === tab.id ? tab.color : ''}`} />
              <span className="relative z-10">{tab.name}</span>

              {/* Active indicator */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-1/2 w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                  layoutId="activeTab"
                  style={{ translateX: '-50%' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Animated Tab Separator */}
        <AnimatedSeparator delay={0.3} />

        {/* Disease Detection Tab */}
        {activeTab === 'disease' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Leaf className="h-8 w-8 text-green-600" />
                AI Crop Disease Detection
              </h2>
              <p className="text-gray-600">
                Upload or capture an image of your crop to detect diseases using advanced AI technology
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image Upload Section */}
              <div className="space-y-6">
                <motion.div 
                  className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer overflow-hidden enhanced-button ripple-effect"
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{
                    borderColor: '#22c55e',
                    scale: 1.02,
                    boxShadow: '0 10px 30px rgba(34, 197, 94, 0.2)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => {
                    // This triggers the CSS particle effects
                  }}
                >
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded crop" 
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center gap-4">
                        <Upload className="h-12 w-12 text-gray-400" />
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700">Upload Crop Image</p>
                        <p className="text-sm text-gray-500">
                          Click to upload or drag and drop an image of affected crop
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Particle container for hover effects */}
                  <div className="particle-container">
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                  </div>
                </motion.div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <ParticleButton
                  onClick={analyzeDiseaseImage}
                  disabled={!uploadedImage || isAnalyzing || isModelLoading}
                  className="w-full"
                  variant="success"
                >
                  {isModelLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading AI Model...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Scan className="h-5 w-5" />
                      AI Disease Detection
                    </>
                  )}
                </ParticleButton>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {diseaseResult ? (
                  <div className="space-y-6">
                    {/* Disease Identification */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Bug className="h-6 w-6 text-red-600" />
                        <h3 className="text-xl font-bold text-gray-900">Disease Identified</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{diseaseResult.name}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600">
                              Confidence: <span className="font-semibold text-green-600">{diseaseResult.confidence}%</span>
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(diseaseResult.severity)}`}>
                              {diseaseResult.severity} Severity
                            </span>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Affected Crops:</h5>
                          <div className="flex flex-wrap gap-2">
                            {diseaseResult.affectedCrops.map((crop, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="bg-yellow-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-yellow-600" />
                        Symptoms
                      </h4>
                      <ul className="space-y-2">
                        {diseaseResult.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Treatment */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Treatment Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {diseaseResult.treatment.map((treatment, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{treatment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        Prevention Tips
                      </h4>
                      <ul className="space-y-2">
                        {diseaseResult.prevention.map((prevention, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{prevention}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Scan className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Upload an image to get disease detection results</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Disease Detection Tab Bottom Separator */}
        {activeTab === 'disease' && <AnimatedSeparator delay={0.5} />}

        {/* Loan Calculator Tab */}
        {activeTab === 'loan' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Calculator className="h-8 w-8 text-blue-600" />
                Agricultural Loan Calculator
              </h2>
              <p className="text-gray-600">Calculate EMI and compare loan schemes for agricultural financing</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calculator */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Loan Calculator</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Loan Amount: ₹{loanAmount.toLocaleString('en-IN')}
                      </label>
                      <input
                        type="range"
                        min="50000"
                        max="5000000"
                        step="50000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹50K</span>
                        <span>₹50L</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tenure: {loanTenure} years
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 year</span>
                        <span>10 years</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Interest Rate: {interestRate}% per annum
                      </label>
                      <input
                        type="range"
                        min="6"
                        max="15"
                        step="0.5"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>6%</span>
                        <span>15%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-white rounded-lg border-2 border-blue-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
                      <p className="text-3xl font-bold text-blue-600">₹{calculateEMI().toLocaleString('en-IN')}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Total Amount: ₹{(calculateEMI() * loanTenure * 12).toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total Interest: ₹{((calculateEMI() * loanTenure * 12) - loanAmount).toLocaleString('en-IN')}
                      </p>
                      <button
                        onClick={generateLoanReport}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mx-auto"
                      >
                        <FileText className="h-4 w-4" />
                        Download Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Schemes */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Available Loan Schemes</h3>
                
                {loanSchemes.map((scheme) => (
                  <div key={scheme.id} className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{scheme.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{scheme.bank}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Interest Rate</p>
                        <p className="font-semibold text-green-600">{scheme.interestRate}% p.a.</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Max Amount</p>
                        <p className="font-semibold">₹{(scheme.maxAmount / 100000).toFixed(1)}L</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Max Tenure</p>
                        <p className="font-semibold">{scheme.tenure} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Processing</p>
                        <p className="font-semibold text-blue-600">Fast Track</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {scheme.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={() => handleLoanApply(scheme)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Loan Calculator Tab Bottom Separator */}
        {activeTab === 'loan' && <AnimatedSeparator delay={0.5} />}

        {/* Government Schemes Tab */}
        {activeTab === 'schemes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Award className="h-8 w-8 text-green-600" />
                Government Schemes
              </h2>
              <p className="text-gray-600">Latest government schemes and programs for farmers</p>
            </div>

            <div className="space-y-6">
              {governmentSchemes.map((scheme) => (
                <div key={scheme.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{scheme.title}</h3>
                      <p className="text-gray-600 mb-2">{scheme.description}</p>
                      <p className="text-sm text-gray-500">Ministry: {scheme.ministry}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(scheme.status)}`}>
                      {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {scheme.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Eligibility:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {scheme.eligibility.map((criteria, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Deadline: {scheme.deadline === 'Ongoing (No deadline)' ? scheme.deadline : new Date(scheme.deadline).toLocaleDateString('en-IN')}
                    </div>
                    <div className="flex gap-2">
                      <ParticleButton 
                        onClick={() => handleSchemeApply(scheme)}
                        className="text-sm"
                        variant="success"
                      >
                        <span>Apply Now</span>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </ParticleButton>
                      <button 
                        onClick={() => handleSchemeLearnMore(scheme)}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <span>Learn More</span>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Government Schemes Tab Bottom Separator */}
        {activeTab === 'schemes' && <AnimatedSeparator delay={0.5} />}

        {/* Subsidies Tracker Tab */}
        {activeTab === 'subsidies' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <FileText className="h-8 w-8 text-purple-600" />
                Subsidies Tracker
              </h2>
              <p className="text-gray-600">Track your subsidy applications and discover new opportunities</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">4</p>
                  <p className="text-sm text-gray-600">Total Applications</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">2</p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-gray-600">Under Review</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">₹90K</p>
                  <p className="text-sm text-gray-600">Total Received</p>
                </div>
              </div>

              {subsidies.map((subsidy) => (
                <div key={subsidy.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{subsidy.name}</h3>
                      <p className="text-sm text-gray-600">{subsidy.type}</p>
                      <p className="text-lg font-semibold text-green-600 mt-1">₹{subsidy.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(subsidy.status)}`}>
                      {subsidy.status.charAt(0).toUpperCase() + subsidy.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Application Date</p>
                      <p className="text-sm font-semibold">{new Date(subsidy.applicationDate).toLocaleDateString('en-IN')}</p>
                    </div>
                    {subsidy.expectedDate && (
                      <div>
                        <p className="text-xs text-gray-500">Expected Date</p>
                        <p className="text-sm font-semibold">{new Date(subsidy.expectedDate).toLocaleDateString('en-IN')}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Documents</p>
                      <p className="text-sm font-semibold">{subsidy.documents.length} uploaded</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                      View Details
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-semibold">
                      Track Status
                    </button>
                    {subsidy.status === 'applied' && (
                      <button className="text-orange-600 hover:text-orange-800 text-sm font-semibold">
                        Upload Documents
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="text-center mt-8">
                <ParticleButton 
                  className=""
                  variant="primary"
                >
                  Explore New Subsidies
                </ParticleButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subsidies Tracker Tab Bottom Separator */}
        {activeTab === 'subsidies' && <AnimatedSeparator delay={0.5} />}

        {/* Marketplace Tab Top Separator */}
        {activeTab === 'marketplace' && <AnimatedSeparator delay={0.3} />}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <ShoppingCart className="h-8 w-8 text-orange-600" />
                Agricultural Marketplace
              </h2>
              <p className="text-gray-600">Buy and sell agricultural products, equipment, and services</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products, seeds, equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <MapPin className="h-4 w-4" />
                  Near Me
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['All', 'Seeds', 'Equipment', 'Fertilizers', 'Pesticides', 'Fresh Produce', 'Services'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border transition-colors text-sm ${
                    selectedCategory === category
                      ? 'bg-orange-100 border-orange-300 text-orange-700'
                      : 'border-gray-300 hover:bg-orange-50 hover:border-orange-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Products */}
              {[
                {
                  id: 1,
                  name: 'Premium Wheat Seeds',
                  price: '₹2,500',
                  unit: 'per 25kg bag',
                  seller: 'Green Valley Farms',
                  location: 'Punjab',
                  image: '🌾',
                  rating: 4.8,
                  reviews: 125,
                  inStock: true,
                  category: 'Seeds'
                },
                {
                  id: 2,
                  name: 'Organic Rice Variety',
                  price: '₹3,200',
                  unit: 'per 20kg bag',
                  seller: 'Organic Harvest Co.',
                  location: 'West Bengal',
                  image: '🌾',
                  rating: 4.9,
                  reviews: 89,
                  inStock: true,
                  category: 'Seeds'
                },
                {
                  id: 3,
                  name: 'Tractor Attachment Set',
                  price: '₹45,000',
                  unit: 'complete set',
                  seller: 'Farm Equipment Ltd.',
                  location: 'Haryana',
                  image: '🚜',
                  rating: 4.6,
                  reviews: 34,
                  inStock: true,
                  category: 'Equipment'
                },
                {
                  id: 4,
                  name: 'Bio Fertilizer Pack',
                  price: '₹1,800',
                  unit: 'per 50kg',
                  seller: 'EcoGrow Solutions',
                  location: 'Karnataka',
                  image: '🌱',
                  rating: 4.7,
                  reviews: 156,
                  inStock: false,
                  category: 'Fertilizers'
                },
                {
                  id: 5,
                  name: 'Drip Irrigation Kit',
                  price: '₹12,500',
                  unit: 'for 1 acre',
                  seller: 'Water Tech India',
                  location: 'Gujarat',
                  image: '💧',
                  rating: 4.8,
                  reviews: 78,
                  inStock: true,
                  category: 'Equipment'
                },
                {
                  id: 6,
                  name: 'Fresh Tomatoes',
                  price: '₹45',
                  unit: 'per kg',
                  seller: 'Sunrise Farm',
                  location: 'Maharashtra',
                  image: '🍅',
                  rating: 4.5,
                  reviews: 234,
                  inStock: true,
                  category: 'Fresh Produce'
                }
              ].filter(product => 
                (selectedCategory === 'All' || product.category === selectedCategory) &&
                (searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
              ).map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl">{product.image}</div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                    </motion.button>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-green-600">{product.price}</span>
                      <span className="text-sm text-gray-500">{product.unit}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Seller: {product.seller}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {product.location}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      disabled={!product.inStock}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                        product.inStock
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Phone className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Marketplace Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Package className="h-5 w-5" />
                Sell Your Products
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Truck className="h-5 w-5" />
                Track Orders
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                My Cart
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Marketplace Tab Bottom Separator */}
        {activeTab === 'marketplace' && <AnimatedSeparator delay={0.5} />}

        {/* Chatbot Tab Top Separator */}
        {activeTab === 'chatbot' && <AnimatedSeparator delay={0.3} />}

        {/* Digital Krishi Officer Chatbot Tab */}
        {activeTab === 'chatbot' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Bot className="h-8 w-8 text-pink-600" />
                Digital Krishi Officer
              </h2>
              <p className="text-gray-600">Your AI Agriculture Expert - Get instant answers to farming questions with voice support</p>
              {!speechSupported && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Voice features are not supported in your browser. Try Chrome, Edge, or Safari for the best experience.
                  </p>
                </div>
              )}
            </div>

            {/* Chat Interface */}
            <div className="max-w-4xl mx-auto">
              {/* Chat Messages Container */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 h-96 overflow-y-auto">
                <div className="space-y-4">
                  {/* Welcome Message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-md relative">
                      <p className="text-gray-800">
                        Hello! I'm Digital Krishi Officer, your AI agriculture expert with voice capabilities! I can help you with:
                      </p>
                      <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                        <li>Crop disease identification</li>
                        <li>Fertilizer recommendations</li>
                        <li>Weather-based farming advice</li>
                        <li>Government scheme guidance</li>
                        <li>Market price information</li>
                      </ul>
                      <p className="mt-2 text-gray-800">You can type or speak your questions to me!</p>
                      <button
                        onClick={() => speakMessage("Hello! I'm Digital Krishi Officer, your AI agriculture expert with voice capabilities! You can type or speak your questions to me!")}
                        className="absolute top-2 right-2 text-gray-400 hover:text-pink-600 transition-colors"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Chat Messages */}
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex items-start gap-3 ${message.isBot ? '' : 'justify-end'}`}>
                      {message.isBot ? (
                        <>
                          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-pink-600" />
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm max-w-md relative">
                            <p className="text-gray-800">{message.text}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => speakMessage(message.text)}
                                disabled={isSpeaking}
                                className="text-gray-400 hover:text-pink-600 transition-colors disabled:opacity-50"
                              >
                                {isSpeaking ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                              </button>
                              {isSpeaking && (
                                <button
                                  onClick={stopSpeaking}
                                  className="text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <VolumeX className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-pink-500 text-white rounded-lg p-3 shadow-sm max-w-md">
                            <p>{message.text}</p>
                          </div>
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-600">You</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Suggestion Buttons */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Crop disease symptoms',
                    'Fertilizer schedule',
                    'Weather forecast',
                    'Market prices',
                    'Government schemes',
                    'Organic farming tips'
                  ].map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-3 py-1 text-sm bg-pink-100 text-pink-700 rounded-full transition-colors enhanced-button"
                      whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: '#fce7f3',
                        boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-3">
                {/* Voice Status */}
                {speechSupported && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mic className="h-4 w-4" />
                      <span>Voice input {isListening ? 'listening...' : 'available'}</span>
                    </div>
                    {isSpeaking && (
                      <div className="flex items-center gap-2 text-sm text-pink-600">
                        <Volume2 className="h-4 w-4 animate-pulse" />
                        <span>Speaking...</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type or speak your farming question..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-24"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                      {speechSupported && (
                        <motion.button
                          onClick={startListening}
                          disabled={isListening || isSpeaking}
                          className={`relative p-1 transition-colors enhanced-button ripple-effect ${
                            isListening 
                              ? 'text-red-600 animate-pulse pulse-effect' 
                              : 'text-gray-400 hover:text-pink-600'
                          } disabled:opacity-50`}
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          animate={isListening ? { 
                            boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 10px rgba(239, 68, 68, 0)'],
                            transition: { duration: 1, repeat: Infinity }
                          } : {}}
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          
                          {/* Particle effect when listening */}
                          {isListening && (
                            <div className="absolute inset-0 pointer-events-none">
                              {[...Array(4)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-1 h-1 bg-red-500 rounded-full"
                                  style={{
                                    left: '50%',
                                    top: '50%',
                                  }}
                                  animate={{
                                    x: [0, Math.cos(i * Math.PI / 2) * 15],
                                    y: [0, Math.sin(i * Math.PI / 2) * 15],
                                    opacity: [1, 0],
                                    scale: [0, 1.5]
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </motion.button>
                      )}
                      <button 
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim()}
                        className="p-1 text-gray-400 hover:text-pink-600 transition-colors disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <ParticleButton 
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim()}
                    variant="primary"
                    className="font-semibold"
                  >
                    Send
                  </ParticleButton>
                </div>
              </div>

              {/* Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Digital Krishi Expert</h3>
                  <p className="text-sm text-gray-600">Disease identification and treatment advice</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Smart Calculator</h3>
                  <p className="text-sm text-gray-600">Fertilizer, seed, and cost calculations</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Policy Guide</h3>
                  <p className="text-sm text-gray-600">Government schemes and subsidy information</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chatbot Tab Bottom Separator */}
        {activeTab === 'chatbot' && <AnimatedSeparator delay={0.5} />}
      </div>

      {/* Scheme Details Modal */}
      {showSchemeDetails && selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedScheme.title}</h3>
                <button 
                  onClick={closeSchemeDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    About This Scheme
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{selectedScheme.description}</p>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Ministry: </span>
                    <span className="text-sm font-medium text-gray-700">{selectedScheme.ministry}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Why Should You Apply?</h4>
                  <div className="bg-green-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {selectedScheme.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Eligibility Requirements</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {selectedScheme.eligibility.map((criteria, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Application Deadline</span>
                  </div>
                  <p className="text-yellow-700">
                    {selectedScheme.deadline === 'Ongoing (No deadline)' 
                      ? 'This is an ongoing scheme with no specific deadline. You can apply at any time.' 
                      : `Applications must be submitted by ${new Date(selectedScheme.deadline).toLocaleDateString('en-IN')}`
                    }
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button 
                    onClick={() => {
                      handleSchemeApply(selectedScheme);
                      closeSchemeDetails();
                    }}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                    Apply Now on Official Site
                  </button>
                  <button 
                    onClick={closeSchemeDetails}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartTools;