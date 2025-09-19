import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  AlertTriangle,
  CheckCircle,
  Target,
  Send,
  ArrowLeft,
  Shield,
  X
} from 'lucide-react';
import ParticleButton from './ParticleButton';

interface SuccessStoryFormData {
  fullName: string;
  age: string;
  location: string;
  farmSize: string;
  farmType: string;
  storyTitle: string;
  challengesFaced: string;
  solutionsImplemented: string;
  resultsAchieved: string;
  adviceToOthers: string;
  contactEmail: string;
  contactPhone: string;
  allowContact: boolean;
  allowPublish: boolean;
}

interface SuccessStoryFormProps {
  onClose: () => void;
}

const SuccessStoryForm: React.FC<SuccessStoryFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<SuccessStoryFormData>({
    fullName: '',
    age: '',
    location: '',
    farmSize: '',
    farmType: '',
    storyTitle: '',
    challengesFaced: '',
    solutionsImplemented: '',
    resultsAchieved: '',
    adviceToOthers: '',
    contactEmail: '',
    contactPhone: '',
    allowContact: false,
    allowPublish: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<SuccessStoryFormData>>({});

  const totalSteps = 4;

  const farmTypes = [
    'Organic Farming',
    'Traditional Farming',
    'Hydroponics',
    'Mixed Farming',
    'Dairy Farming',
    'Poultry Farming',
    'Crop Farming',
    'Horticulture',
    'Other'
  ];

  const handleInputChange = (field: keyof SuccessStoryFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<SuccessStoryFormData> = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.farmType) newErrors.farmType = 'Please select farm type';
        break;
      case 2:
        if (!formData.storyTitle.trim()) newErrors.storyTitle = 'Story title is required';
        if (!formData.challengesFaced.trim()) newErrors.challengesFaced = 'Please describe challenges faced';
        break;
      case 3:
        if (!formData.solutionsImplemented.trim()) newErrors.solutionsImplemented = 'Please describe solutions implemented';
        if (!formData.resultsAchieved.trim()) newErrors.resultsAchieved = 'Please describe results achieved';
        break;
      case 4:
        if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';
        if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
          newErrors.contactEmail = 'Please enter a valid email';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/success-stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        throw new Error('Failed to submit story');
      }
    } catch (error) {
      console.error('Error submitting success story:', error);
      alert('Failed to submit story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-raleway font-bold text-gray-900 mb-2">Story Submitted!</h3>
          <p className="text-gray-600 font-raleway mb-4">
            Thank you for sharing your inspiring journey. We'll review your story and get back to you soon.
          </p>
          <button
            onClick={onClose}
            className="text-green-600 hover:text-green-700 font-raleway font-semibold"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-raleway font-bold">Share Your Success Story</h2>
              <p className="text-green-100 font-raleway">Inspire others with your agricultural journey</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm font-raleway mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-white rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-raleway font-bold text-gray-900">Personal Information</h3>
                  <p className="text-gray-600 font-raleway">Tell us about yourself and your farm</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway ${
                        errors.fullName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1 font-raleway">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway"
                      placeholder="Your age"
                      min="18"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway ${
                        errors.location ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="City, State"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1 font-raleway">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                      Farm Size
                    </label>
                    <input
                      type="text"
                      value={formData.farmSize}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway"
                      placeholder="e.g., 5 acres, 2 hectares"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                      Farm Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.farmType}
                      onChange={(e) => handleInputChange('farmType', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway ${
                        errors.farmType ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select farm type</option>
                      {farmTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.farmType && <p className="text-red-500 text-sm mt-1 font-raleway">{errors.farmType}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Story Title and Challenges */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-raleway font-bold text-gray-900">Your Story & Challenges</h3>
                  <p className="text-gray-600 font-raleway">Share your journey and the obstacles you faced</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                      Story Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.storyTitle}
                      onChange={(e) => handleInputChange('storyTitle', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway ${
                        errors.storyTitle ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Give your success story a compelling title"
                    />
                    {errors.storyTitle && <p className="text-red-500 text-sm mt-1 font-raleway">{errors.storyTitle}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                      Challenges Faced <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.challengesFaced}
                      onChange={(e) => handleInputChange('challengesFaced', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway ${
                        errors.challengesFaced ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Describe the main challenges, problems, or difficulties you faced in your farming journey..."
                    />
                    {errors.challengesFaced && <p className="text-red-500 text-sm mt-1 font-raleway">{errors.challengesFaced}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Solutions and Results */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-raleway font-bold text-gray-900">Solutions & Results</h3>
                  <p className="text-gray-600 font-raleway">Tell us how you overcame challenges and what you achieved</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                      Solutions Implemented <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.solutionsImplemented}
                      onChange={(e) => handleInputChange('solutionsImplemented', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway ${
                        errors.solutionsImplemented ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Describe the strategies, technologies, methods, or approaches you used to solve your challenges..."
                    />
                    {errors.solutionsImplemented && <p className="text-red-500 text-sm mt-1 font-raleway">{errors.solutionsImplemented}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                      Results Achieved <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.resultsAchieved}
                      onChange={(e) => handleInputChange('resultsAchieved', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway ${
                        errors.resultsAchieved ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Share the specific results, improvements, increase in yield, income, or other benefits you achieved..."
                    />
                    {errors.resultsAchieved && <p className="text-red-500 text-sm mt-1 font-raleway">{errors.resultsAchieved}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                      Advice to Other Farmers
                    </label>
                    <textarea
                      value={formData.adviceToOthers}
                      onChange={(e) => handleInputChange('adviceToOthers', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway"
                      placeholder="Share any advice, tips, or recommendations for other farmers..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Contact and Permissions */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-raleway font-bold text-gray-900">Contact & Privacy</h3>
                  <p className="text-gray-600 font-raleway">How should we contact you and share your story?</p>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway ${
                          errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.contactEmail && <p className="text-red-500 text-sm mt-1 font-raleway">{errors.contactEmail}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-raleway"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allowContact}
                          onChange={(e) => handleInputChange('allowContact', e.target.checked)}
                          className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-raleway font-medium text-gray-900">Allow Contact for Follow-up</span>
                          <p className="text-sm font-raleway text-gray-600">
                            We may contact you for additional details or feature your story in our publications.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allowPublish}
                          onChange={(e) => handleInputChange('allowPublish', e.target.checked)}
                          className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-raleway font-medium text-gray-900">Allow Public Sharing</span>
                          <p className="text-sm font-raleway text-gray-600">
                            Your story can be shared on our website and social media to inspire other farmers.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-raleway font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}
            </div>

            <div>
              {currentStep < totalSteps ? (
                <ParticleButton
                  onClick={handleNext}
                  variant="primary"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-raleway font-semibold"
                >
                  Next Step
                </ParticleButton>
              ) : (
                <ParticleButton
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  variant="success"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-raleway font-semibold flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Story
                    </>
                  )}
                </ParticleButton>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessStoryForm;