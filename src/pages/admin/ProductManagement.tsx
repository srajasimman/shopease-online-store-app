import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Filter,
  X,
  FileText
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { categories } from '../../data/mockData';
import { format } from 'date-fns';
import { Product } from '../../types';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const ProductManagement: React.FC = () => {
  const { products, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      (searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === '' || product.category === selectedCategory)
    )
    .sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return sortDirection === 'asc' 
          ? valueA.getTime() - valueB.getTime() 
          : valueB.getTime() - valueA.getTime();
      } else {
        // Handle number comparison
        const numA = Number(valueA);
        const numB = Number(valueB);
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
    });
  
  const handleSort = (column: keyof Product) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Product Management</h1>
        <Link to="/admin/products/add">
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters {selectedCategory && '(1)'}
            </Button>
            
            <div className="relative">
              <Select
                options={[
                  { value: 'All', label: `All Products (${products.length})` },
                  { value: 'Low', label: 'Low Inventory' }
                ]}
                value="All"
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">Filters</h3>
              {selectedCategory && (
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Select
                  label="Category"
                  options={[
                    { value: '', label: 'All Categories' },
                    ...categories.map(category => ({ value: category, label: category }))
                  ]}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value)}
                />
              </div>
            </div>
          </div>
        )}
        
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
            <Button onClick={handleClearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('name')}
                      className="group flex items-center space-x-1 focus:outline-none"
                    >
                      <span>Product</span>
                      {sortColumn === 'name' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-gray-500" />
                        )
                      ) : (
                        <div className="h-4 w-4 opacity-0 group-hover:opacity-100">
                          <ArrowUp className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('category')}
                      className="group flex items-center space-x-1 focus:outline-none"
                    >
                      <span>Category</span>
                      {sortColumn === 'category' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-gray-500" />
                        )
                      ) : (
                        <div className="h-4 w-4 opacity-0 group-hover:opacity-100">
                          <ArrowUp className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('price')}
                      className="group flex items-center space-x-1 focus:outline-none"
                    >
                      <span>Price</span>
                      {sortColumn === 'price' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-gray-500" />
                        )
                      ) : (
                        <div className="h-4 w-4 opacity-0 group-hover:opacity-100">
                          <ArrowUp className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('inventory')}
                      className="group flex items-center space-x-1 focus:outline-none"
                    >
                      <span>Inventory</span>
                      {sortColumn === 'inventory' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-gray-500" />
                        )
                      ) : (
                        <div className="h-4 w-4 opacity-0 group-hover:opacity-100">
                          <ArrowUp className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('updatedAt')}
                      className="group flex items-center space-x-1 focus:outline-none"
                    >
                      <span>Last Updated</span>
                      {sortColumn === 'updatedAt' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-gray-500" />
                        )
                      ) : (
                        <div className="h-4 w-4 opacity-0 group-hover:opacity-100">
                          <ArrowUp className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${
                        product.inventory <= 0 
                          ? 'text-red-600' 
                          : product.inventory < 5 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                      }`}>
                        {product.inventory <= 0 
                          ? 'Out of stock' 
                          : product.inventory < 5 
                            ? `Low stock (${product.inventory})` 
                            : product.inventory}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(product.updatedAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <Link 
                          to={`/admin/products/edit/${product.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredProducts.length}</span> of{' '}
                <span className="font-medium">{filteredProducts.length}</span> products
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;