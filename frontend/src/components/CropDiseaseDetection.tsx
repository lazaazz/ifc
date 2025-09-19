import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Scan, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Download,
  Share,
  History,
  Zap,
  Leaf,
  Bug,
  Eye,
  BookOpen
} from 'lucide-react';

interface DetectionResult {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  cropAffected: string;
  timeToTreat: string;
}

interface ScanHistory {
  id: number;
  date: string;
  image: string;
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  crop: string;
}

const CropDiseaseDetection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock scan history
  const scanHistory: ScanHistory[] = [
    {
      id: 1,
      date: '2025-09-15',
      image: '/api/placeholder/100/100',
      disease: 'Tomato Late Blight',
      confidence: 92,
      severity: 'High',
      crop: 'Tomato'
    },
    {
      id: 2,
      date: '2025-09-14',
      image: '/api/placeholder/100/100',
      disease: 'Wheat Rust',
      confidence: 87,
      severity: 'Medium',
      crop: 'Wheat'
    },
    {
      id: 3,
      date: '2025-09-13',
      image: '/api/placeholder/100/100',
      disease: 'Healthy Plant',
      confidence: 96,
      severity: 'Low',
      crop: 'Rice'
    }
  ];

  // Mock detection results
  const mockResults: DetectionResult[] = [
    {
      disease: 'Tomato Late Blight',
      confidence: 92,
      severity: 'High',
      description: 'Late blight is a serious disease that affects tomato plants, causing dark spots on leaves and fruit.',
      symptoms: [
        'Dark brown spots on leaves',
        'White fuzzy growth on leaf undersides',
        'Brown lesions on stems',
        'Fruit rot with dark patches'
      ],
      causes: [
        'High humidity (>90%)',
        'Temperature between 15-25°C',
        'Poor air circulation',
        'Overhead watering'
      ],
      treatment: [
        'Apply copper-based fungicide',
        'Remove affected plant parts immediately',
        'Improve air circulation',
        'Reduce watering frequency'
      ],
      prevention: [
        'Plant resistant varieties',
        'Ensure proper spacing',
        'Use drip irrigation',
        'Apply preventive fungicides'
      ],
      cropAffected: 'Tomato',
      timeToTreat: 'Immediate action required'
    },
    {
      disease: 'Healthy Plant',
      confidence: 96,
      severity: 'Low',
      description: 'The plant appears healthy with no signs of disease or pest damage.',
      symptoms: ['Green, vibrant leaves', 'Normal growth pattern', 'No discoloration'],
      causes: ['Good plant health'],
      treatment: ['Continue current care routine'],
      prevention: ['Maintain current practices', 'Regular monitoring'],
      cropAffected: 'Various',
      timeToTreat: 'No immediate action needed'
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setDetectionResult(null);
    }
  };

  const handleScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    
    // Mock API call with delay
    setTimeout(() => {
      // Simulate AI detection
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setDetectionResult(randomResult);
      setIsScanning(false);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low': return CheckCircle;
      case 'Medium': return AlertTriangle;
      case 'High': return AlertTriangle;
      default: return Info;
    }
  };

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
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Crop Disease Detection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered disease detection for early identification and treatment. 
            Upload a photo of your crop to get instant diagnosis and treatment recommendations.
          </p>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Zap className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">95%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Bug className="h-8 w-8 text-earth-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">150+</div>
            <div className="text-gray-600">Diseases Detected</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Leaf className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">50+</div>
            <div className="text-gray-600">Crop Types</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Eye className="h-8 w-8 text-earth-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1M+</div>
            <div className="text-gray-600">Scans Completed</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Plant Image</h2>
              
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors duration-300 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <img 
                      src={previewUrl} 
                      alt="Selected crop" 
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-xl font-semibold text-gray-700">Upload a crop image</p>
                      <p className="text-gray-500">or drag and drop here</p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <span className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-lg">
                        <Camera className="h-5 w-5" />
                        Take Photo
                      </span>
                      <span className="inline-flex items-center gap-2 bg-earth-100 text-earth-700 px-4 py-2 rounded-lg">
                        <Upload className="h-5 w-5" />
                        Upload File
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Scan Button */}
              {selectedImage && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 inline-flex items-center gap-2"
                  >
                    {isScanning ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Scan className="h-5 w-5" />
                        Start Disease Detection
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Tips */}
              <div className="mt-8 bg-primary-50 rounded-lg p-6">
                <h3 className="font-semibold text-primary-900 mb-3">Tips for Better Results:</h3>
                <ul className="space-y-2 text-primary-800 text-sm">
                  <li>• Ensure good lighting conditions</li>
                  <li>• Take close-up photos of affected areas</li>
                  <li>• Include leaves, stems, or fruits showing symptoms</li>
                  <li>• Avoid blurry or dark images</li>
                  <li>• Capture multiple angles if possible</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Scan History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Recent Scans</h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <History className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {scanHistory.slice(0, 3).map(scan => {
                  const SeverityIcon = getSeverityIcon(scan.severity);
                  return (
                    <div key={scan.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{scan.disease}</p>
                        <p className="text-gray-600 text-xs">{scan.date}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <SeverityIcon className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{scan.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="w-full mt-4 text-primary-600 hover:text-primary-700 text-sm font-semibold">
                View All History
              </button>
            </div>

            {/* Quick Guide */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-600" />
                Quick Guide
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Take Photo</p>
                    <p className="text-gray-600 text-xs">Capture clear image of affected plant part</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">AI Analysis</p>
                    <p className="text-gray-600 text-xs">Our AI analyzes the image for diseases</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Get Results</p>
                    <p className="text-gray-600 text-xs">Receive diagnosis and treatment plan</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detection Results */}
        {detectionResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detection Results</h2>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                    <Download className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                    <Share className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Result Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{detectionResult.disease}</div>
                  <div className="text-gray-600">Detected Disease</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">{detectionResult.confidence}%</div>
                  <div className="text-gray-600">Confidence Level</div>
                </div>
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getSeverityColor(detectionResult.severity)}`}>
                    {React.createElement(getSeverityIcon(detectionResult.severity), { className: "h-5 w-5" })}
                    {detectionResult.severity} Severity
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{detectionResult.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Symptoms</h3>
                  <ul className="space-y-2">
                    {detectionResult.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Causes</h3>
                  <ul className="space-y-2">
                    {detectionResult.causes.map((cause, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-earth-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Treatment</h3>
                  <ul className="space-y-2">
                    {detectionResult.treatment.map((treatment, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Prevention</h3>
                  <ul className="space-y-2">
                    {detectionResult.prevention.map((prevention, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{prevention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Required */}
              <div className="mt-8 bg-earth-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="h-6 w-6 text-earth-600" />
                  <h3 className="text-lg font-bold text-earth-900">Action Required</h3>
                </div>
                <p className="text-earth-800">{detectionResult.timeToTreat}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CropDiseaseDetection;