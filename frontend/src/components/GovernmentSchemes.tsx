import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Heart, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Eye,
  Bookmark,
  Share,
  Bell,
  ChevronDown,
  Star,
  Users,
  IndianRupee,
  Clock,
  Award,
  Target,
  FileText,
  ExternalLink
} from 'lucide-react';

interface GovernmentScheme {
  _id: string;
  title: string;
  description: string;
  fullDescription: string;
  launchDate: string;
  deadline?: string;
  category: string;
  ministry: string;
  budget: number;
  beneficiaries: number;
  eligibility: string[];
  documents: string[];
  applicationProcess: string[];
  benefits: string[];
  link?: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
  targetStates: string[];
  likes: number;
  views: number;
  shares: number;
  featured: boolean;
}

const GovernmentSchemes: React.FC = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [likedSchemes, setLikedSchemes] = useState<string[]>([]);
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<string[]>([]);
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Schemes', count: 156 },
    { id: 'subsidy', name: 'Subsidies', count: 45 },
    { id: 'insurance', name: 'Insurance', count: 23 },
    { id: 'loan', name: 'Loans & Credit', count: 34 },
    { id: 'training', name: 'Training & Skills', count: 28 },
    { id: 'technology', name: 'Technology', count: 18 },
    { id: 'infrastructure', name: 'Infrastructure', count: 8 }
  ];

  const priorities = [
    { id: 'all', name: 'All Priorities' },
    { id: 'high', name: 'High Priority' },
    { id: 'medium', name: 'Medium Priority' },
    { id: 'low', name: 'Low Priority' }
  ];

  useEffect(() => {
    // Enhanced mock data with comprehensive information
    const mockSchemes: GovernmentScheme[] = [
      {
        _id: '1',
        title: 'PM-KISAN Samman Nidhi Yojana',
        description: 'Direct income support to all landholding farmers families to supplement their financial needs.',
        fullDescription: 'The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme that provides income support to all landholding farmers\' families across the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities as well as domestic needs.',
        launchDate: '2019-02-24',
        deadline: '2025-12-31',
        category: 'subsidy',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        budget: 600000000000, // 60,000 crores
        beneficiaries: 120000000,
        eligibility: [
          'All landholding farmers families',
          'Families holding cultivable land',
          'Valid Aadhaar card required',
          'Bank account mandatory'
        ],
        documents: [
          'Aadhaar Card',
          'Bank Account Details',
          'Land Records',
          'Identity Proof'
        ],
        applicationProcess: [
          'Visit PM-KISAN portal',
          'Register with Aadhaar number',
          'Fill application form',
          'Upload required documents',
          'Submit for verification'
        ],
        benefits: [
          '₹6,000 annual income support',
          'Three installments of ₹2,000 each',
          'Direct bank transfer',
          'No intermediaries involved'
        ],
        link: 'https://pmkisan.gov.in',
        isActive: true,
        priority: 'high',
        targetStates: ['All India'],
        likes: 125000,
        views: 2500000,
        shares: 45000,
        featured: true
      },
      {
        _id: '2',
        title: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Comprehensive crop insurance scheme providing financial support to farmers in case of crop failure.',
        fullDescription: 'PMFBY aims to provide insurance coverage and financial support to the farmers in the event of failure of any of the notified crop as a result of natural calamities, pests & diseases.',
        launchDate: '2016-01-13',
        deadline: '2025-09-30',
        category: 'insurance',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        budget: 150000000000, // 15,000 crores
        beneficiaries: 55000000,
        eligibility: [
          'All farmers growing notified crops',
          'Loanee and non-loanee farmers',
          'Tenant farmers with valid documents',
          'Sharecroppers eligible'
        ],
        documents: [
          'Land Records (Khewat/Khasra)',
          'Sowing Certificate',
          'Bank Account Details',
          'Aadhaar Card',
          'Tenant/Sharecropper Agreement (if applicable)'
        ],
        applicationProcess: [
          'Contact nearest bank branch',
          'Fill crop insurance application',
          'Submit required documents',
          'Pay premium amount',
          'Receive policy document'
        ],
        benefits: [
          'Coverage for all stages of crop cycle',
          'Low premium rates (2% for Kharif, 1.5% for Rabi)',
          'Quick settlement of claims',
          'Technology-enabled claims process'
        ],
        link: 'https://pmfby.gov.in',
        isActive: true,
        priority: 'high',
        targetStates: ['All India'],
        likes: 89000,
        views: 1800000,
        shares: 32000,
        featured: true
      },
      {
        _id: '3',
        title: 'Kisan Credit Card (KCC) Scheme',
        description: 'Flexible credit facility for farmers to meet their agricultural and allied needs.',
        fullDescription: 'KCC scheme aims to provide adequate and timely credit support from the banking system under a single window to the farmers for their cultivation and other needs.',
        launchDate: '1998-08-01',
        category: 'loan',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        budget: 450000000000, // 45,000 crores
        beneficiaries: 70000000,
        eligibility: [
          'All farmers including tenant farmers',
          'Self Help Group (SHG) members',
          'Joint Liability Groups (JLG) members',
          'Farmers engaged in allied activities'
        ],
        documents: [
          'Land Records',
          'Identity Proof',
          'Address Proof',
          'Income Certificate',
          'Crop Plan'
        ],
        applicationProcess: [
          'Visit nearest bank branch',
          'Fill KCC application form',
          'Submit documents',
          'Bank verification',
          'KCC issuance'
        ],
        benefits: [
          'Flexible credit limit',
          'Interest subvention up to 3%',
          'No collateral for loans up to ₹1.6 lakh',
          'Simplified documentation'
        ],
        link: 'https://kcc.gov.in',
        isActive: true,
        priority: 'high',
        targetStates: ['All India'],
        likes: 67000,
        views: 1400000,
        shares: 28000,
        featured: true
      },
      {
        _id: '4',
        title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
        description: 'Promotion of organic farming through cluster approach and PGS certification.',
        fullDescription: 'PKVY aims to promote organic farming through cluster approach and Participatory Guarantee System (PGS) certification in identified clusters.',
        launchDate: '2015-04-01',
        deadline: '2025-03-31',
        category: 'subsidy',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        budget: 12000000000, // 1,200 crores
        beneficiaries: 1000000,
        eligibility: [
          'Farmers willing to convert to organic',
          'Cluster formation (minimum 20 farmers)',
          'Contiguous area of 50 hectares',
          '3-year conversion period commitment'
        ],
        documents: [
          'Land Records',
          'Group Formation Certificate',
          'Organic Farming Plan',
          'Bank Details'
        ],
        applicationProcess: [
          'Form farmer cluster',
          'Submit cluster application',
          'Training and capacity building',
          'Organic conversion process',
          'PGS certification'
        ],
        benefits: [
          '₹50,000 per hectare over 3 years',
          'Organic inputs support',
          'Market linkage assistance',
          'Certification support'
        ],
        link: 'https://pgsindia-ncof.gov.in',
        isActive: true,
        priority: 'medium',
        targetStates: ['All India'],
        likes: 34000,
        views: 680000,
        shares: 15000,
        featured: false
      },
      {
        _id: '5',
        title: 'National Agriculture Market (e-NAM)',
        description: 'Online trading platform for agricultural commodities in India.',
        fullDescription: 'e-NAM is a pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.',
        launchDate: '2016-04-14',
        category: 'technology',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        budget: 20000000000, // 2,000 crores
        beneficiaries: 17500000,
        eligibility: [
          'All farmers and traders',
          'Registration on e-NAM portal',
          'Valid trade license',
          'Bank account for transactions'
        ],
        documents: [
          'Trade License',
          'Bank Account Details',
          'Identity Proof',
          'Address Proof',
          'PAN Card'
        ],
        applicationProcess: [
          'Register on e-NAM portal',
          'Upload required documents',
          'Complete verification process',
          'Start online trading',
          'Receive payments digitally'
        ],
        benefits: [
          'Better price discovery',
          'Reduced transaction costs',
          'Transparent auction process',
          'Direct market access'
        ],
        link: 'https://enam.gov.in',
        isActive: true,
        priority: 'medium',
        targetStates: ['All India'],
        likes: 45000,
        views: 950000,
        shares: 20000,
        featured: false
      }
    ];

    // Simulate API call
    const fetchSchemes = async () => {
      try {
        setTimeout(() => {
          setSchemes(mockSchemes);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching schemes:', error);
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || scheme.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const toggleLike = (schemeId: string) => {
    setLikedSchemes(prev => 
      prev.includes(schemeId) 
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId]
    );
  };

  const toggleBookmark = (schemeId: string) => {
    setBookmarkedSchemes(prev => 
      prev.includes(schemeId) 
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      subsidy: 'bg-green-100 text-green-800',
      insurance: 'bg-blue-100 text-blue-800',
      loan: 'bg-purple-100 text-purple-800',
      training: 'bg-orange-100 text-orange-800',
      technology: 'bg-indigo-100 text-indigo-800',
      infrastructure: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    const crores = amount / 10000000;
    return `₹${crores.toLocaleString('en-IN')} Cr`;
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-earth-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

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
            Government Schemes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and track the latest government schemes, subsidies, and programs 
            designed to support farmers and agricultural development across India.
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
            <Award className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">150+</div>
            <div className="text-gray-600">Active Schemes</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <IndianRupee className="h-8 w-8 text-earth-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">₹12L Cr</div>
            <div className="text-gray-600">Total Budget</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">25 Cr</div>
            <div className="text-gray-600">Beneficiaries</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Target className="h-8 w-8 text-earth-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">95%</div>
            <div className="text-gray-600">Coverage Rate</div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search schemes, ministries, or benefits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>{priority.name}</option>
              ))}
            </select>

            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Set Alerts
            </button>
          </div>
        </motion.div>

        {/* Schemes Grid */}
        <div className="space-y-8">
          {filteredSchemes.map((scheme, index) => (
            <motion.div
              key={scheme._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Scheme Header */}
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{scheme.title}</h3>
                      {scheme.featured && (
                        <span className="bg-earth-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                      <span className={`px-3 py-1 rounded-full font-semibold ${getCategoryColor(scheme.category)}`}>
                        {scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full font-semibold ${getPriorityColor(scheme.priority)}`}>
                        {scheme.priority.charAt(0).toUpperCase() + scheme.priority.slice(1)} Priority
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Launched: {formatDate(scheme.launchDate)}
                      </span>
                      {scheme.deadline && (
                        <span className="flex items-center gap-1 text-red-600">
                          <Clock className="h-4 w-4" />
                          Deadline: {formatDate(scheme.deadline)}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-4">{scheme.description}</p>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary-600">{formatCurrency(scheme.budget)}</div>
                        <div className="text-xs text-gray-500">Budget</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-earth-600">{(scheme.beneficiaries / 10000000).toFixed(1)}Cr</div>
                        <div className="text-xs text-gray-500">Beneficiaries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{scheme.views / 1000}K</div>
                        <div className="text-xs text-gray-500">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{scheme.likes / 1000}K</div>
                        <div className="text-xs text-gray-500">Likes</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    <button
                      onClick={() => toggleLike(scheme._id)}
                      className={`p-3 rounded-full transition-colors duration-300 ${
                        likedSchemes.includes(scheme._id)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${likedSchemes.includes(scheme._id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => toggleBookmark(scheme._id)}
                      className={`p-3 rounded-full transition-colors duration-300 ${
                        bookmarkedSchemes.includes(scheme._id)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-500'
                      }`}
                    >
                      <Bookmark className={`h-5 w-5 ${bookmarkedSchemes.includes(scheme._id) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                      <Share className="h-5 w-5" />
                    </button>
                    {scheme.link && (
                      <a
                        href={scheme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => setExpandedScheme(expandedScheme === scheme._id ? null : scheme._id)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  {expandedScheme === scheme._id ? 'Show Less' : 'View Details'}
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform duration-300 ${
                      expandedScheme === scheme._id ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
              </div>

              {/* Expanded Details */}
              {expandedScheme === scheme._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 bg-gray-50 p-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Eligibility */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary-600" />
                        Eligibility Criteria
                      </h4>
                      <ul className="space-y-2">
                        {scheme.eligibility.map((criteria, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Documents */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary-600" />
                        Required Documents
                      </h4>
                      <ul className="space-y-2">
                        {scheme.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-earth-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Application Process */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary-600" />
                        Application Process
                      </h4>
                      <ol className="space-y-2">
                        {scheme.applicationProcess.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {idx + 1}
                            </div>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary-600" />
                        Key Benefits
                      </h4>
                      <ul className="space-y-2">
                        {scheme.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Full Description */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Detailed Description</h4>
                    <p className="text-gray-700 leading-relaxed">{scheme.fullDescription}</p>
                  </div>

                  {/* Ministry Info */}
                  <div className="mt-6 bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-600">Implemented by:</span>
                        <span className="font-semibold text-gray-900">{scheme.ministry}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {scheme.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {scheme.likes.toLocaleString()} likes
                        </span>
                        <span className="flex items-center gap-1">
                          <Share className="h-4 w-4" />
                          {scheme.shares.toLocaleString()} shares
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Schemes Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedPriority('all');
              }}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated with New Schemes
            </h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our alerts and never miss a new government scheme or important deadline.
            </p>
            <div className="flex gap-4">
              <button className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                <Bell className="h-5 w-5" />
                Subscribe to Alerts
              </button>
              <button className="flex-1 bg-earth-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-earth-700 transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Support
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GovernmentSchemes;