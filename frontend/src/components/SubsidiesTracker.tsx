import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  Eye,
  Plus,
  MapPin,
  Calendar,
  IndianRupee,
  Download,
  Bell,
  TrendingUp,
  Users,
  Target,
  Award
} from 'lucide-react';

interface SubsidyApplication {
  id: number;
  schemeName: string;
  applicationId: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  amount: number;
  estimatedDisbursement: string;
  requiredDocuments: string[];
  submittedDocuments: string[];
  remarks?: string;
  category: string;
}

interface AvailableSubsidy {
  id: number;
  name: string;
  description: string;
  category: string;
  amount: number;
  maxAmount: number;
  eligibility: string[];
  documents: string[];
  deadline: string;
  beneficiaries: number;
  disbursed: number;
  state: string;
  applicationProcess: string[];
  featured: boolean;
}

const SubsidiesTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'available'>('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'seeds', name: 'Seeds & Fertilizers' },
    { id: 'equipment', name: 'Farm Equipment' },
    { id: 'irrigation', name: 'Irrigation' },
    { id: 'insurance', name: 'Crop Insurance' },
    { id: 'processing', name: 'Food Processing' },
    { id: 'organic', name: 'Organic Farming' }
  ];

  const statusFilters = [
    { id: 'all', name: 'All Status' },
    { id: 'pending', name: 'Pending' },
    { id: 'under-review', name: 'Under Review' },
    { id: 'approved', name: 'Approved' },
    { id: 'rejected', name: 'Rejected' }
  ];

  const myApplications: SubsidyApplication[] = [
    {
      id: 1,
      schemeName: "PM-KISAN Samman Nidhi",
      applicationId: "PMK2025001234",
      appliedDate: "2025-08-15",
      status: "approved",
      amount: 6000,
      estimatedDisbursement: "2025-10-15",
      requiredDocuments: ["Aadhaar Card", "Bank Details", "Land Records"],
      submittedDocuments: ["Aadhaar Card", "Bank Details", "Land Records"],
      category: "seeds",
      remarks: "Approved for 3 installments of ₹2000 each"
    },
    {
      id: 2,
      schemeName: "Pradhan Mantri Fasal Bima Yojana",
      applicationId: "PMFBY2025005678",
      appliedDate: "2025-09-01",
      status: "under-review",
      amount: 15000,
      estimatedDisbursement: "2025-11-01",
      requiredDocuments: ["Land Records", "Crop Details", "Bank Account", "Identity Proof"],
      submittedDocuments: ["Land Records", "Crop Details", "Bank Account"],
      category: "insurance"
    },
    {
      id: 3,
      schemeName: "Soil Health Card Scheme",
      applicationId: "SHC2025009876",
      appliedDate: "2025-09-10",
      status: "pending",
      amount: 0,
      estimatedDisbursement: "2025-10-30",
      requiredDocuments: ["Land Records", "Application Form"],
      submittedDocuments: ["Application Form"],
      category: "seeds"
    },
    {
      id: 4,
      schemeName: "Kisan Credit Card Subsidy",
      applicationId: "KCC2025012345",
      appliedDate: "2025-08-20",
      status: "rejected",
      amount: 50000,
      estimatedDisbursement: "-",
      requiredDocuments: ["Income Certificate", "Land Records", "Bank Details"],
      submittedDocuments: ["Bank Details"],
      category: "equipment",
      remarks: "Incomplete documentation - missing income certificate"
    }
  ];

  const availableSubsidies: AvailableSubsidy[] = [
    {
      id: 1,
      name: "National Mission for Sustainable Agriculture",
      description: "Support for climate-resilient agriculture practices and water conservation",
      category: "irrigation",
      amount: 50000,
      maxAmount: 200000,
      eligibility: ["All farmers", "Minimum 1 acre land", "Water scarcity area"],
      documents: ["Land records", "Water test report", "Project proposal"],
      deadline: "2025-12-31",
      beneficiaries: 125000,
      disbursed: 85000,
      state: "All India",
      applicationProcess: [
        "Register on official portal",
        "Submit required documents",
        "Field verification by officials",
        "Approval and fund disbursement"
      ],
      featured: true
    },
    {
      id: 2,
      name: "Paramparagat Krishi Vikas Yojana",
      description: "Financial assistance for organic farming practices and certification",
      category: "organic",
      amount: 31000,
      maxAmount: 50000,
      eligibility: ["Farmers transitioning to organic", "Group formation", "3-year commitment"],
      documents: ["Land records", "Group formation certificate", "Organic plan"],
      deadline: "2025-11-15",
      beneficiaries: 89000,
      disbursed: 67000,
      state: "All India",
      applicationProcess: [
        "Form farmer groups (minimum 20)",
        "Prepare organic farming plan",
        "Submit application through state nodal agency",
        "Training and certification process"
      ],
      featured: true
    },
    {
      id: 3,
      name: "Agriculture Infrastructure Fund",
      description: "Financing for post-harvest infrastructure development",
      category: "processing",
      amount: 100000,
      maxAmount: 2000000,
      eligibility: ["Farmers", "FPOs", "Agri-entrepreneurs", "Start-ups"],
      documents: ["Project report", "Financial projections", "Land/lease documents"],
      deadline: "2025-10-30",
      beneficiaries: 45000,
      disbursed: 32000,
      state: "All India",
      applicationProcess: [
        "Prepare detailed project report",
        "Apply through designated banks",
        "Technical evaluation",
        "Loan sanction and disbursement"
      ],
      featured: false
    },
    {
      id: 4,
      name: "Micro Irrigation Fund",
      description: "Interest subvention for micro irrigation systems",
      category: "irrigation",
      amount: 75000,
      maxAmount: 500000,
      eligibility: ["All farmers", "Water stressed areas", "NABARD eligible"],
      documents: ["Land records", "Water availability certificate", "Cost estimates"],
      deadline: "2025-11-30",
      beneficiaries: 67000,
      disbursed: 45000,
      state: "All India",
      applicationProcess: [
        "Apply through implementing agency",
        "Site verification",
        "Technical approval",
        "Installation and payment"
      ],
      featured: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'under-review': return Eye;
      case 'rejected': return AlertTriangle;
      default: return Clock;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredApplications = myApplications.filter(app => {
    const matchesSearch = app.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredSubsidies = availableSubsidies.filter(subsidy => {
    const matchesSearch = subsidy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subsidy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || subsidy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDocumentProgress = (required: string[], submitted: string[]) => {
    return Math.round((submitted.length / required.length) * 100);
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
            Subsidies Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your subsidy applications and discover new government schemes. 
            Never miss an opportunity to benefit from agricultural support programs.
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
            <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">₹2.1L Cr</div>
            <div className="text-gray-600">Total Disbursed</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Users className="h-8 w-8 text-earth-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">8.5 Cr</div>
            <div className="text-gray-600">Beneficiaries</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Target className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">150+</div>
            <div className="text-gray-600">Active Schemes</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Award className="h-8 w-8 text-earth-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                  activeTab === 'applications'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Applications ({myApplications.length})
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                  activeTab === 'available'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available Schemes ({availableSubsidies.length})
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search schemes or applications..."
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
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            {activeTab === 'applications' && (
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {statusFilters.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            )}

            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Application
            </button>
          </div>
        </motion.div>

        {/* My Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {filteredApplications.map((application, index) => {
              const StatusIcon = getStatusIcon(application.status);
              const documentProgress = getDocumentProgress(application.requiredDocuments, application.submittedDocuments);
              
              return (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{application.schemeName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {application.applicationId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </span>
                        {application.amount > 0 && (
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {formatCurrency(application.amount)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4 lg:mt-0">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(application.status)}`}>
                        <StatusIcon className="h-4 w-4" />
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}
                      </span>
                      <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Document Progress */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Document Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{documentProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              documentProgress === 100 ? 'bg-green-500' : 'bg-primary-500'
                            }`}
                            style={{ width: `${documentProgress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {application.submittedDocuments.length} of {application.requiredDocuments.length} documents submitted
                        </div>
                      </div>
                    </div>

                    {/* Required Documents */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Required Documents</h4>
                      <ul className="space-y-1">
                        {application.requiredDocuments.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            {application.submittedDocuments.includes(doc) ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className={application.submittedDocuments.includes(doc) ? 'text-gray-900' : 'text-gray-600'}>
                              {doc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Applied</span>
                          <span className="text-gray-600">{new Date(application.appliedDate).toLocaleDateString()}</span>
                        </div>
                        {application.estimatedDisbursement !== '-' && (
                          <div className="flex justify-between">
                            <span>Est. Disbursement</span>
                            <span className="text-primary-600 font-semibold">{new Date(application.estimatedDisbursement).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {application.remarks && (
                    <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-yellow-800">Remarks</h4>
                          <p className="text-sm text-yellow-700">{application.remarks}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-gray-600 mb-6">You haven't applied for any subsidies yet, or no applications match your search criteria.</p>
                <button 
                  onClick={() => setActiveTab('available')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Browse Available Schemes
                </button>
              </div>
            )}
          </div>
        )}

        {/* Available Schemes Tab */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredSubsidies.map((subsidy, index) => (
              <motion.div
                key={subsidy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{subsidy.name}</h3>
                      {subsidy.featured && (
                        <span className="bg-earth-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{subsidy.description}</p>
                  </div>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500">Amount Range</div>
                    <div className="font-semibold text-primary-600">
                      {formatCurrency(subsidy.amount)} - {formatCurrency(subsidy.maxAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Deadline</div>
                    <div className="font-semibold text-gray-900">
                      {new Date(subsidy.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Beneficiaries</div>
                    <div className="font-semibold text-gray-900">
                      {subsidy.beneficiaries.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Coverage</div>
                    <div className="font-semibold text-gray-900">{subsidy.state}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Disbursement Progress</span>
                    <span>{Math.round((subsidy.disbursed / subsidy.beneficiaries) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(subsidy.disbursed / subsidy.beneficiaries) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Eligibility</h4>
                  <ul className="space-y-1">
                    {subsidy.eligibility.slice(0, 3).map((criteria, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    Apply Now
                  </button>
                  <button className="p-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="p-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                    <Bell className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation Guide</h3>
              <p className="text-gray-600 text-sm mb-4">Get help with required documents and application process</p>
              <button className="text-primary-600 hover:text-primary-700 font-semibold">Learn More</button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-earth-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Local Office</h3>
              <p className="text-gray-600 text-sm mb-4">Locate nearest government office for application support</p>
              <button className="text-earth-600 hover:text-earth-700 font-semibold">Find Office</button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Alerts</h3>
              <p className="text-gray-600 text-sm mb-4">Get notified about new schemes and application deadlines</p>
              <button className="text-primary-600 hover:text-primary-700 font-semibold">Set Alert</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubsidiesTracker;