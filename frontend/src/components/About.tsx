import React from 'react';
import { motion } from 'framer-motion';
import { Target, Heart, Globe, Lightbulb } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Our Mission',
      description: 'To bridge the gap between traditional farming and modern technology, empowering farmers with tools and knowledge for sustainable agriculture.',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Community First',
      description: 'Building a supportive community where farmers and agricultural workers can connect, share knowledge, and grow together.',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Sustainable Future',
      description: 'Promoting eco-friendly farming practices and helping farmers adopt sustainable methods for long-term environmental health.',
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology to provide smart solutions for crop management, market access, and agricultural productivity.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-primary-50 to-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-raleway font-bold text-gray-900 mb-6">
            About <span className="text-primary-600">I.F.C</span>
          </h2>
          <p className="text-xl font-raleway font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
            India Farmers Club is a revolutionary platform designed to transform the agricultural landscape by connecting farmers, workers, and agricultural enthusiasts in a unified digital ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-primary-100"
            >
              <div className="text-primary-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-raleway font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 font-raleway leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-primary-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-raleway font-bold text-gray-900 mb-6">
                Transforming Agriculture Through Technology
              </h3>
              <div className="space-y-4 text-gray-600 font-raleway">
                <p className="leading-relaxed">
                  Our platform serves as a comprehensive digital hub where farmers can showcase their products, connect with agricultural workers, access the latest government schemes, and benefit from AI-powered assistance.
                </p>
                <p className="leading-relaxed">
                  We believe that technology should serve agriculture, not complicate it. That's why we've designed I.F.C to be intuitive, accessible, and truly beneficial for the farming community.
                </p>
                <p className="leading-relaxed">
                  From small-scale farmers to large agricultural enterprises, our platform adapts to meet the diverse needs of India's agricultural sector, fostering growth, innovation, and prosperity.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-earth-100 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">2024</div>
                  <div className="text-gray-600">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
                  <div className="text-gray-600">States Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
                  <div className="text-gray-600">Secure</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;