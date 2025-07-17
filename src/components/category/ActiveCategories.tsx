import React, { useState, useEffect } from 'react';
import { Plus, RotateCcw, Filter, Edit, Eye, Trash2, Calendar, Wrench } from 'lucide-react';
import { getAllCategories, deleteCategory } from '../../api/apiMethods';

interface Category {
  id: number;
  name: string;
  description: string;
  status: boolean;
  date: string;
  servicesCount: number;
  image: string;
}

interface ActiveCategoriesProps {
  onAddCategory: () => void;
  onEdit: (id: number) => void;
}

const ActiveCategories: React.FC<ActiveCategoriesProps> = ({ onAddCategory, onEdit }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    categoryName: '',
    status: '',
    fromDate: '',
    toDate: ''
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchActiveCategories();
  }, []);

  const fetchActiveCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCategories({});
      if (response && response.data) {
        // Filter only active categories and transform API response
        const activeCategories = response.data
          .filter((category: any) => category.status === 'active' || category.status === true)
          .map((category: any) => ({
            id: category.id || category._id,
            name: category.name || category.categoryName,
            description: category.description || category.categoryDescription || '',
            status: true, // All are active since we filtered
            date: category.createdAt ? new Date(category.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
            servicesCount: category.servicesCount || 0,
            image: category.image || 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'
          }));
        setCategories(activeCategories);
      }
    } catch (error: any) {
      console.error('Error fetching active categories:', error);
      setError(error.message || 'Failed to fetch active categories');
      // Fallback to sample data if API fails
      setCategories([
        {
          id: 1,
          name: 'AC Repair & Services',
          description: 'Professional AC repair and maintenance services',
          status: true,
          date: '25 Oct 2023',
          servicesCount: 15,
          image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: 2,
          name: 'Computer/Laptop Repair & Services',
          description: 'Expert computer and laptop repair services',
          status: true,
          date: '20 Oct 2023',
          servicesCount: 12,
          image: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    setShowFilter(false);
    setFilters({
      categoryName: '',
      status: '',
      fromDate: '',
      toDate: ''
    });
    fetchActiveCategories();
  };

  const handleFilterSubmit = () => {
    console.log('Applying filters:', filters);
    // Implement filtering logic here
  };

  const handleStatusToggle = async (id: number) => {
    try {
      // Update category status via API
      // await updateCategory(id.toString(), { status: 'inactive' });
      
      // Remove from active categories list since it's no longer active
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error updating category status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id.toString());
        setCategories(prev => prev.filter(cat => cat.id !== id));
        alert('Category deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting category:', error);
        alert(error.message || 'Failed to delete category');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading active categories...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Active Categories</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p>Error: {error}</p>
            <button 
              onClick={fetchActiveCategories}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 animate-in slide-in-from-top duration-300 flex">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <select
                  value={filters.categoryName}
                  onChange={(e) => handleFilterChange('categoryName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                onClick={handleFilterSubmit}
                className="px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={category.status}
                      onChange={() => handleStatusToggle(category.id)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{category.name}</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{category.servicesCount}</span> Technicians
                  </div>
                  <div className="text-sm text-gray-500">{category.date}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(category.id)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                    View Technicians
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active categories found</h3>
            <p className="text-gray-500 mb-4">All categories are currently inactive or none exist.</p>
            <button
              onClick={onAddCategory}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveCategories;