import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  IndianRupee, 
  Calendar, 
  TrendingUp, 
  PieChart,
  Phone,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  Share
} from 'lucide-react';

interface LoanCalculation {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emi: number;
  totalAmount: number;
  totalInterest: number;
  monthlyBreakdown: MonthlyPayment[];
}

interface MonthlyPayment {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

interface LoanScheme {
  id: number;
  name: string;
  bank: string;
  interestRate: number;
  maxAmount: number;
  tenure: number;
  description: string;
  eligibility: string[];
  documents: string[];
  features: string[];
  subsidyAvailable: boolean;
  processingFee: string;
}

const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(60);
  const [selectedScheme, setSelectedScheme] = useState<string>('');
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const loanSchemes: LoanScheme[] = [
    {
      id: 1,
      name: "Kisan Credit Card (KCC)",
      bank: "All Banks",
      interestRate: 7.0,
      maxAmount: 300000,
      tenure: 12,
      description: "Short term credit facility for crop production and allied activities",
      eligibility: ["All farmers", "Tenant farmers", "Sharecroppers"],
      documents: ["Land records", "Identity proof", "Bank statements"],
      features: ["Flexible repayment", "Interest subvention", "No collateral up to ₹1.6 lakh"],
      subsidyAvailable: true,
      processingFee: "Nil"
    },
    {
      id: 2,
      name: "Agricultural Term Loan",
      bank: "SBI, HDFC, ICICI",
      interestRate: 8.5,
      maxAmount: 2000000,
      tenure: 84,
      description: "Medium to long term loans for agricultural investments",
      eligibility: ["Farmers with land ownership", "Minimum 2 years farming"],
      documents: ["Land documents", "Income proof", "Project report"],
      features: ["Flexible tenure", "Moratorium period", "Step-up/down facility"],
      subsidyAvailable: false,
      processingFee: "0.5% - 1%"
    },
    {
      id: 3,
      name: "PM-KISAN FPO Loan",
      bank: "NABARD",
      interestRate: 6.5,
      maxAmount: 1500000,
      tenure: 72,
      description: "Loans for Farmer Producer Organizations",
      eligibility: ["Registered FPOs", "Minimum 50 farmer members"],
      documents: ["FPO registration", "Business plan", "Audited accounts"],
      features: ["Interest subvention", "Collateral free", "Credit guarantee"],
      subsidyAvailable: true,
      processingFee: "Nil"
    },
    {
      id: 4,
      name: "MUDRA Agri Loan",
      bank: "All Scheduled Banks",
      interestRate: 9.0,
      maxAmount: 1000000,
      tenure: 60,
      description: "Micro loans for agriculture and allied activities",
      eligibility: ["Small farmers", "Agri entrepreneurs", "Rural youth"],
      documents: ["Identity proof", "Address proof", "Income documents"],
      features: ["No collateral", "Quick processing", "Flexible repayment"],
      subsidyAvailable: false,
      processingFee: "Up to 1%"
    },
    {
      id: 5,
      name: "PMEGP Agriculture",
      bank: "Various Banks",
      interestRate: 8.0,
      maxAmount: 2500000,
      tenure: 96,
      description: "Employment generation in agriculture sector",
      eligibility: ["18+ years", "Class VIII pass", "Not availed subsidy before"],
      documents: ["Educational certificates", "Caste certificate", "Project report"],
      features: ["25-35% subsidy", "Margin money assistance", "Backward area benefits"],
      subsidyAvailable: true,
      processingFee: "As per bank norms"
    }
  ];

  const calculateEMI = (principal: number, rate: number, time: number): LoanCalculation => {
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, time)) / 
                (Math.pow(1 + monthlyRate, time) - 1);
    
    const totalAmount = emi * time;
    const totalInterest = totalAmount - principal;
    
    // Calculate monthly breakdown
    const monthlyBreakdown: MonthlyPayment[] = [];
    let remainingBalance = principal;
    
    for (let i = 1; i <= Math.min(time, 12); i++) {
      const interestPortion = remainingBalance * monthlyRate;
      const principalPortion = emi - interestPortion;
      remainingBalance -= principalPortion;
      
      monthlyBreakdown.push({
        month: i,
        emi: Math.round(emi),
        principal: Math.round(principalPortion),
        interest: Math.round(interestPortion),
        balance: Math.round(remainingBalance)
      });
    }

    return {
      loanAmount: principal,
      interestRate: rate,
      tenure: time,
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      monthlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculateEMI(loanAmount, interestRate, tenure);
    setCalculation(result);
  }, [loanAmount, interestRate, tenure]);

  const handleSchemeSelect = (scheme: LoanScheme) => {
    setInterestRate(scheme.interestRate);
    setTenure(Math.min(scheme.tenure, 96));
    setLoanAmount(Math.min(loanAmount, scheme.maxAmount));
    setSelectedScheme(scheme.name);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getEligibilityStatus = (amount: number, scheme: LoanScheme) => {
    return amount <= scheme.maxAmount;
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
            Loan Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your agricultural loan EMI and explore various government schemes. 
            Plan your farming investments with confidence.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <IndianRupee className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">₹50L</div>
            <div className="text-gray-600">Max Loan Amount</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <TrendingUp className="h-8 w-8 text-earth-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">6.5%</div>
            <div className="text-gray-600">Lowest Interest Rate</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Calendar className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">10 Years</div>
            <div className="text-gray-600">Maximum Tenure</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <CheckCircle className="h-8 w-8 text-earth-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">35%</div>
            <div className="text-gray-600">Government Subsidy</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="h-6 w-6 text-primary-600" />
                Loan Calculator
              </h2>

              {/* Input Controls */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Loan Amount: {formatCurrency(loanAmount)}
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max="2500000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>₹50K</span>
                    <span>₹25L</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Interest Rate: {interestRate}% per annum
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="15"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>6%</span>
                    <span>15%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Loan Tenure: {tenure} months ({Math.round(tenure/12)} years)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    step="6"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1 Year</span>
                    <span>10 Years</span>
                  </div>
                </div>
              </div>

              {/* Calculation Results */}
              {calculation && (
                <div className="bg-gradient-to-r from-primary-50 to-earth-50 rounded-xl p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary-600 mb-1">
                        {formatCurrency(calculation.emi)}
                      </div>
                      <div className="text-gray-600">Monthly EMI</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-earth-600 mb-1">
                        {formatCurrency(calculation.totalAmount)}
                      </div>
                      <div className="text-gray-600">Total Amount</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatCurrency(calculation.totalInterest)}
                      </div>
                      <div className="text-gray-600">Total Interest</div>
                    </div>
                  </div>
                </div>
              )}

              {/* EMI Breakdown Chart */}
              {calculation && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Breakdown</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-32 h-32 relative">
                        <svg className="w-32 h-32" viewBox="0 0 42 42">
                          <circle
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                          />
                          <circle
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke="#22c55e"
                            strokeWidth="3"
                            strokeDasharray={`${(calculation.loanAmount / calculation.totalAmount) * 100} ${100 - (calculation.loanAmount / calculation.totalAmount) * 100}`}
                            strokeDashoffset="25"
                            className="transition-all duration-1000"
                          />
                          <circle
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke="#eab308"
                            strokeWidth="3"
                            strokeDasharray={`${(calculation.totalInterest / calculation.totalAmount) * 100} ${100 - (calculation.totalInterest / calculation.totalAmount) * 100}`}
                            strokeDashoffset={`${25 - (calculation.loanAmount / calculation.totalAmount) * 100}`}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PieChart className="h-8 w-8 text-gray-600" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                        <span>Principal ({Math.round((calculation.loanAmount / calculation.totalAmount) * 100)}%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-earth-500 rounded-full"></div>
                        <span>Interest ({Math.round((calculation.totalInterest / calculation.totalAmount) * 100)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Report
                </button>
                <button className="flex-1 bg-earth-600 text-white py-3 rounded-lg font-semibold hover:bg-earth-700 transition-colors flex items-center justify-center gap-2">
                  <Share className="h-5 w-5" />
                  Share Results
                </button>
              </div>
            </div>

            {/* EMI Schedule Table */}
            {calculation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6 mt-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">EMI Schedule (First 12 Months)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">Month</th>
                        <th className="text-right py-3 px-4">EMI</th>
                        <th className="text-right py-3 px-4">Principal</th>
                        <th className="text-right py-3 px-4">Interest</th>
                        <th className="text-right py-3 px-4">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculation.monthlyBreakdown.map((payment) => (
                        <tr key={payment.month} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-semibold">{payment.month}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(payment.emi)}</td>
                          <td className="py-3 px-4 text-right text-primary-600">{formatCurrency(payment.principal)}</td>
                          <td className="py-3 px-4 text-right text-earth-600">{formatCurrency(payment.interest)}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(payment.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Loan Schemes Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Available Loan Schemes</h3>
              
              <div className="space-y-4">
                {loanSchemes.map((scheme) => {
                  const isEligible = getEligibilityStatus(loanAmount, scheme);
                  return (
                    <div 
                      key={scheme.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                        selectedScheme === scheme.name 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                      onClick={() => handleSchemeSelect(scheme)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">{scheme.name}</h4>
                        {isEligible ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Interest Rate:</span>
                          <span className="font-semibold text-primary-600">{scheme.interestRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Amount:</span>
                          <span>{formatCurrency(scheme.maxAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Tenure:</span>
                          <span>{scheme.tenure} months</span>
                        </div>
                        {scheme.subsidyAvailable && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            <span>Subsidy Available</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2">{scheme.description}</p>
                    </div>
                  );
                })}
              </div>
              
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Compare All Schemes
              </button>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary-600" />
                Loan Tips
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Maintain good credit score (750+) for better rates</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>KCC offers lowest interest rates for farmers</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Government schemes provide subsidy benefits</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Shorter tenure means higher EMI but less interest</span>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-primary-600 to-earth-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Need Help?</h3>
              <p className="text-sm mb-4 text-primary-100">
                Our loan experts can help you choose the best scheme for your needs.
              </p>
              <button className="w-full bg-white text-primary-600 py-2 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Expert
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scheme Comparison Table */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12 bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Scheme Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Scheme</th>
                    <th className="text-center py-3 px-4">Interest Rate</th>
                    <th className="text-center py-3 px-4">Max Amount</th>
                    <th className="text-center py-3 px-4">Max Tenure</th>
                    <th className="text-center py-3 px-4">Subsidy</th>
                    <th className="text-center py-3 px-4">Processing Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {loanSchemes.map((scheme) => (
                    <tr key={scheme.id} className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-semibold text-gray-900">{scheme.name}</div>
                          <div className="text-gray-500">{scheme.bank}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-semibold text-primary-600">
                        {scheme.interestRate}%
                      </td>
                      <td className="py-4 px-4 text-center">
                        {formatCurrency(scheme.maxAmount)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {scheme.tenure} months
                      </td>
                      <td className="py-4 px-4 text-center">
                        {scheme.subsidyAvailable ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600">
                        {scheme.processingFee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;