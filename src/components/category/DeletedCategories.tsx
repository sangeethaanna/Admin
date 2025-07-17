import React, { useState, useEffect } from 'react';
import { Plus, RotateCcw, Filter, Edit, Eye, Trash2, Calendar, Wrench } from 'lucide-react';
import { getAllCategories } from '../../api/apiMethods';

interface Category {
  id: number;
  name: string;
  description: string;
  status: boolean;
  date: string;
  servicesCount: number;
  image: string;
}

interface DeletedCategoriesProps {
  onAddCategory: () => void;
  onEdit: (id: number) => void;
}

const DeletedCategories: React.FC<DeletedCategoriesProps> = ({ onAddCategory, onEdit }) => {
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
    fetchDeletedCategories();
  }, []);

  const fetchDeletedCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real application, you would have a separate endpoint for deleted categories
      // For now, we'll simulate this with sample data
      // const response = await getAllCategories({ deleted: true });
      
      // Simulating deleted categories with sample data
      setTimeout(() => {
        setCategories([
          {
            id: 1,
            name: 'Old AC Repair Service',
            description: 'Discontinued AC repair service',
            status: false,
            date: '15 Sep 2023',
            servicesCount: 5,
            image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'
          },
          {
            id: 2,
            name: 'Legacy Computer Services',
            description: 'Old computer repair services',
            status: false,
            date: '10 Sep 2023',
            servicesCount: 3,
            image: 'https://images.pexels.com/photos/3735781/pexels-photo-3735781.jpeg?auto=compress&cs=tinysrgb&w=400'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error('Error fetching deleted categories:', error);
      setError(error.message || 'Failed to fetch deleted categories');
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
    fetchDeletedCategories();
  };

  const handleFilterSubmit = () => {
    console.log('Applying filters:', filters);
    // Implement filtering logic here
  };

  const handleRestore = async (id: number) => {
    if (window.confirm('Are you sure you want to restore this category?')) {
      try {
        // In a real app, you would call a restore API endpoint
        // await restoreCategory(id.toString());
        
        setCategories(prev => prev.filter(cat => cat.id !== id));
        alert('Category restored successfully!');
      } catch (error: any) {
        console.error('Error restoring category:', error);
        alert(error.message || 'Failed to restore category');
      }
    }
  };

  const handlePermanentDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to permanently delete this category? This action cannot be undone.')) {
      try {
        // In a real app, you would call a permanent delete API endpoint
        // await permanentDeleteCategory(id.toString());
        
        setCategories(prev => prev.filter(cat => cat.id !== id));
        alert('Category permanently deleted!');
      } catch (error: any) {
        console.error('Error permanently deleting category:', error);
        alert(error.message || 'Failed to permanently delete category');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading deleted categories...</span>
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
            <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
              <Trash2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Deleted Categories</h1>
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
              onClick={fetchDeletedCategories}
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
            <div key={category.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 opacity-75">
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover grayscale"
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Deleted
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{category.name}</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    Deleted
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{category.servicesCount}</span> Technicians
                  </div>
                  <div className="text-sm text-gray-500">Deleted: {category.date}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(category.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Permanently Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => handleRestore(category.id)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Restore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted categories found</h3>
            <p className="text-gray-500 mb-4">No categories have been deleted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletedCategories;