import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { categories } from '../data/mockData';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const ProductsPage: React.FC = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice') || '0', 10) : 0,
    max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice') || '5000', 10) : 5000
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  
  // Update filtered products when filters change
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Apply sorting
    switch (sortBy) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (priceRange.min > 0) params.set('minPrice', priceRange.min.toString());
    if (priceRange.max < 5000) params.set('maxPrice', priceRange.max.toString());
    params.set('sort', sortBy);
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, priceRange, sortBy, setSearchParams]);
  
  // Initialize filters from URL on load
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) setSelectedCategory(category);
  }, [searchParams]);
  
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 5000 });
    setSortBy('newest');
    setSearchParams({});
  };
  
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setPriceRange(prev => ({ ...prev, min: value }));
    }
  };
  
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setPriceRange(prev => ({ ...prev, max: value }));
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {selectedCategory ? selectedCategory : 'All Products'}
          <span className="text-gray-500 text-lg ml-2">
            ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'})
          </span>
        </h1>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        <aside className={`hidden md:block w-64 flex-shrink-0`}>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <button 
                  onClick={handleReset}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset All
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input
                        id="all-categories"
                        name="category"
                        type="radio"
                        checked={selectedCategory === ''}
                        onChange={() => setSelectedCategory('')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="all-categories" className="ml-2 text-sm text-gray-700">
                        All Categories
                      </label>
                    </div>
                    
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          id={`category-${category}`}
                          name="category"
                          type="radio"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={handleMinPriceChange}
                      min={0}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={handleMaxPriceChange}
                      min={0}
                    />
                  </div>
                </div>
                
                {/* Sort Order */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Sort By</h4>
                  <Select
                    options={[
                      { value: 'newest', label: 'Newest' },
                      { value: 'priceAsc', label: 'Price: Low to High' },
                      { value: 'priceDesc', label: 'Price: High to Low' },
                      { value: 'name', label: 'Name' }
                    ]}
                    value={sortBy}
                    onChange={(value) => setSortBy(value)}
                    fullWidth
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
        
        {/* Filters Mobile */}
        {isFilterOpen && (
          <div className="md:hidden bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Filters</h3>
              <div className="flex space-x-3">
                <button 
                  onClick={handleReset}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset All
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                <Select
                  options={[
                    { value: '', label: 'All Categories' },
                    ...categories.map(cat => ({ value: cat, label: cat }))
                  ]}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value)}
                  fullWidth
                />
              </div>
              
              {/* Price Range Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={handleMinPriceChange}
                    min={0}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={handleMaxPriceChange}
                    min={0}
                  />
                </div>
              </div>
              
              {/* Sort Order */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sort By</h4>
                <Select
                  options={[
                    { value: 'newest', label: 'Newest' },
                    { value: 'priceAsc', label: 'Price: Low to High' },
                    { value: 'priceDesc', label: 'Price: High to Low' },
                    { value: 'name', label: 'Name' }
                  ]}
                  value={sortBy}
                  onChange={(value) => setSortBy(value)}
                  fullWidth
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Button onClick={() => setIsFilterOpen(false)} fullWidth>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        <div className="flex-grow">
          {/* Mobile sort */}
          <div className="md:hidden mb-4">
            <Select
              label="Sort By"
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'priceAsc', label: 'Price: Low to High' },
                { value: 'priceDesc', label: 'Price: High to Low' },
                { value: 'name', label: 'Name' }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              fullWidth
            />
          </div>
          
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;