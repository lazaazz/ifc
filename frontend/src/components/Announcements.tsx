import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, ExternalLink, Filter } from 'lucide-react';
import axios from 'axios';

interface Announcement {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  link?: string;
  isGovernment: boolean;
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock data for demonstration
  const mockAnnouncements: Announcement[] = [
    {
      _id: '1',
      title: 'PM-KISAN Scheme Registration Open',
      description: 'The Prime Minister Kisan Samman Nidhi (PM-KISAN) scheme is now accepting new registrations. Eligible farmers can receive ₹6,000 annually in three installments.',
      date: '2024-09-15',
      category: 'subsidy',
      link: 'https://pmkisan.gov.in',
      isGovernment: true,
    },
    {
      _id: '2',
      title: 'Crop Insurance Scheme Extended',
      description: 'The Pradhan Mantri Fasal Bima Yojana (PMFBY) deadline has been extended till September 30th. Protect your crops against natural calamities.',
      date: '2024-09-10',
      category: 'insurance',
      link: 'https://pmfby.gov.in',
      isGovernment: true,
    },
    {
      _id: '3',
      title: 'Organic Farming Training Program',
      description: 'Free training program on organic farming techniques and certification process. Limited seats available.',
      date: '2024-09-08',
      category: 'training',
      isGovernment: false,
    },
    {
      _id: '4',
      title: 'Soil Health Card Distribution',
      description: 'Soil Health Cards are being distributed in select districts. Check soil nutrient status and get recommendations for your farmland.',
      date: '2024-09-05',
      category: 'scheme',
      isGovernment: true,
    },
    {
      _id: '5',
      title: 'Agricultural Equipment Subsidy',
      description: 'Government announces 50% subsidy on agricultural equipment for small and marginal farmers. Apply before October 15th.',
      date: '2024-09-01',
      category: 'subsidy',
      isGovernment: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchAnnouncements = async () => {
      try {
        // In a real app, you would make an API call here
        // const response = await axios.get('http://localhost:5000/api/announcements');
        // setAnnouncements(response.data);
        
        // For now, use mock data
        setTimeout(() => {
          setAnnouncements(mockAnnouncements);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'all') return true;
    if (filter === 'government') return announcement.isGovernment;
    return announcement.category === filter;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      subsidy: 'bg-green-100 text-green-800',
      insurance: 'bg-blue-100 text-blue-800',
      training: 'bg-purple-100 text-purple-800',
      scheme: 'bg-yellow-100 text-yellow-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <section id="announcements" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="announcements" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Latest <span className="text-primary-600">Announcements</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest government schemes, subsidies, and agricultural programs
          </p>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              filter === 'all'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            All Announcements
          </button>
          <button
            onClick={() => setFilter('government')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              filter === 'government'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            Government Schemes
          </button>
          <button
            onClick={() => setFilter('subsidy')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              filter === 'subsidy'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            Subsidies
          </button>
          <button
            onClick={() => setFilter('training')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              filter === 'training'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            Training
          </button>
        </motion.div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(announcement.category)}`}>
                    {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                  </span>
                  {announcement.isGovernment && (
                    <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      <Bell className="h-3 w-3 mr-1" />
                      Official
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                  {announcement.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {announcement.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(announcement.date)}
                  </div>
                  
                  {announcement.link && (
                    <a
                      href={announcement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300"
                    >
                      <span className="mr-1">Learn More</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">No announcements found for the selected filter.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Announcements;