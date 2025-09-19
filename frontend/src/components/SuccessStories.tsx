import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import ParticleButton from './ParticleButton';
// Import SuccessStoryForm component
import SuccessStoryForm from './SuccessStoryForm';

const SuccessStories: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Sparkles className="h-12 w-12 text-yellow-300" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-raleway font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200">
              Success Stories
            </h1>
            
            <p className="text-xl md:text-2xl font-raleway font-light text-green-100 mb-8 leading-relaxed">
              Real farmers, Real transformations, Real impact. 
              Discover how technology and determination are revolutionizing agriculture across India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ParticleButton
                onClick={() => setShowForm(true)}
                variant="success"
                className="bg-white text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-semibold flex items-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </ParticleButton>
              
              <button className="text-white hover:text-yellow-200 transition-colors flex items-center gap-2 px-6 py-3">
                <span>Read Stories Below</span>
                <ArrowRight className="h-4 w-4 rotate-90" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 text-white/10 text-8xl animate-pulse">🌾</div>
        <div className="absolute bottom-20 right-20 text-white/10 text-6xl animate-bounce">🚜</div>
        <div className="absolute top-40 right-10 text-white/10 text-4xl animate-pulse delay-1000">🌱</div>
      </div>



      {/* Success Story Form Modal */}
      {showForm && (
        <SuccessStoryForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default SuccessStories;