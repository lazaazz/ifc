import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Package, MapPin, Phone, Mail, Sprout, User, Calendar, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Product,
  addProduct,
  getUserProducts,
  updateProduct,
  deleteProduct
} from '../firebase/services';

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  wage: number;
  duration: string;
  requirements: string[];
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
}

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    quantity: '',
    unit: 'kg',
  });

  // Check if farmer has land (not 'nil')
  const hasLand = user?.acresOfLand && user.acresOfLand !== 'nil';

  useEffect(() => {
    const loadProducts = async () => {
      if (hasLand && user?.uid) {
        const { products: userProducts, error } = await getUserProducts(user.uid);
        if (!error) {
          setProducts(userProducts);
        }
      }
    };

    // Mock jobs for agricultural workers or all farmers
    const mockJobs: Job[] = [
      {
        _id: '1',
        title: 'Wheat Harvesting Help Needed',
        description: 'Looking for experienced workers to help with wheat harvesting. Work will be from 6 AM to 12 PM.',
        location: 'Amritsar, Punjab',
        wage: 300,
        duration: '5 days',
        requirements: ['Experience in harvesting', 'Own transportation preferred'],
        ownerName: 'Rajesh Kumar',
        ownerPhone: '+91 98765 43210',
        createdAt: '2024-09-10',
      },
      {
        _id: '2',
        title: 'Rice Planting Season Work',
        description: 'Seasonal work for rice planting. Good opportunity for experienced farm workers.',
        location: 'Kochi, Kerala',
        wage: 250,
        duration: '10 days',
        requirements: ['Basic farming experience', 'Ability to work in muddy conditions'],
        ownerName: 'Priya Sharma',
        ownerPhone: '+91 87654 32109',
        createdAt: '2024-09-12',
      },
    ];

    // Load products and jobs
    loadProducts();
    setJobs(mockJobs);
  }, [hasLand, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    setLoading(true);

    try {
      const productData = {
        userId: user.uid,
        name: productForm.name,
        price: parseFloat(productForm.price),
        quantity: parseInt(productForm.quantity),
        description: productForm.description,
        category: productForm.category,
        unit: productForm.unit,
      };

      if (editingProduct && editingProduct.id) {
        // Update existing product
        const { error } = await updateProduct(editingProduct.id, productData);
        if (error) {
          throw new Error(error);
        }
        
        // Update local state
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...productData, updatedAt: new Date() }
            : p
        );
        setProducts(updatedProducts);
        setEditingProduct(null);
      } else {
        // Add new product
        const { id, error } = await addProduct(productData);
        if (error) {
          throw new Error(error);
        }
        
        // Add to local state
        if (id) {
          const newProduct: Product = {
            id,
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setProducts([newProduct, ...products]);
        }
      }

      // Reset form
      setProductForm({
        name: '',
        price: '',
        description: '',
        category: '',
        quantity: '',
        unit: 'kg',
      });

      setShowAddForm(false);
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(error.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      quantity: product.quantity.toString(),
      unit: product.unit,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await deleteProduct(productId);
        if (error) {
          throw new Error(error);
        }
        
        setProducts(products.filter(p => p.id !== productId));
      } catch (error: any) {
        console.error('Error deleting product:', error);
        alert(error.message || 'Error deleting product');
      }
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      description: '',
      category: '',
      quantity: '',
      unit: 'kg',
    });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-earth-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {hasLand 
              ? `Manage your farm (${user?.acresOfLand} acres) and products` 
              : 'Find agricultural work opportunities in your area'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Farmer Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-fit"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">
                  {hasLand ? 'Farmer (Land Owner)' : 'Agricultural Worker'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{user?.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{user?.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium">{user?.yearsOfExperience} years</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium">{user?.age} years old</p>
                </div>
              </div>
              {hasLand && (
                <>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Land Size</p>
                      <p className="font-medium">{user?.acresOfLand} acres</p>
                    </div>
                  </div>
                  {user?.cropType && (
                    <div className="flex items-center space-x-3">
                      <Sprout className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Primary Crop</p>
                        <p className="font-medium">{user?.cropType}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Products Management (only for farmers with land) */}
            {hasLand && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                {/* Add/Edit Product Form */}
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 rounded-lg p-6 mb-6"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={productForm.name}
                            onChange={handleInputChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter product name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            name="category"
                            value={productForm.category}
                            onChange={handleInputChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="">Select category</option>
                            <option value="grains">Grains</option>
                            <option value="vegetables">Vegetables</option>
                            <option value="fruits">Fruits</option>
                            <option value="dairy">Dairy</option>
                            <option value="spices">Spices</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={productForm.price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Price per unit"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={productForm.quantity}
                            onChange={handleInputChange}
                            required
                            min="1"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Available quantity"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                          </label>
                          <select
                            name="unit"
                            value={productForm.unit}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="kg">Kilograms</option>
                            <option value="tons">Tons</option>
                            <option value="pieces">Pieces</option>
                            <option value="liters">Liters</option>
                            <option value="bags">Bags</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={productForm.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Describe your product"
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Add Product')}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Products List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id!)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-primary-600">
                          ₹{product.price}/{product.unit}
                        </span>
                        <span className="text-gray-500">
                          {product.quantity} {product.unit} available
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {products.length === 0 && !showAddForm && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No products listed yet. Add your first product!</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Available Jobs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {hasLand ? 'Agricultural Job Opportunities' : 'Available Jobs'}
                </h2>
                <Users className="h-6 w-6 text-gray-400" />
              </div>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <span className="text-sm font-medium text-primary-600">₹{job.wage}/day</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{job.duration}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Contact: {job.ownerName}</p>
                          <p className="text-sm font-medium text-primary-600">{job.ownerPhone}</p>
                        </div>
                        <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors duration-200">
                          Apply
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {jobs.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No job opportunities available at the moment.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;