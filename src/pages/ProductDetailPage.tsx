import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw, Heart, Share2, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { Card, CardContent } from '../components/ui/Card';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const product = getProduct(id || '');
  
  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
  }, [product, navigate]);
  
  if (!product) {
    return null;
  }
  
  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= product.inventory) {
      setQuantity(value);
    }
  };
  
  const handleIncrement = () => {
    if (quantity < product.inventory) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-700">{product.name}</span>
      </div>
      
      <div className="mb-6">
        <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain aspect-square p-4"
          />
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <span className="mr-2 font-medium">Availability:</span>
              {product.inventory > 0 ? (
                <span className="text-green-600">
                  In Stock {product.inventory < 5 && `(Only ${product.inventory} left)`}
                </span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.inventory}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-12 text-center border-x border-gray-300 py-1 focus:outline-none"
                />
                <button 
                  onClick={handleIncrement}
                  disabled={quantity >= product.inventory}
                  className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleAddToCart} 
                disabled={product.inventory === 0}
                className="flex-grow sm:flex-grow-0"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button 
                variant="outline"
                className="flex-grow sm:flex-grow-0"
              >
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
              
              <Button 
                variant="ghost"
                className="sm:ml-2"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-3 divide-x divide-gray-200">
                <div className="p-4 text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs sm:text-sm text-gray-700">Free Shipping</p>
                </div>
                <div className="p-4 text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs sm:text-sm text-gray-700">2-Year Warranty</p>
                </div>
                <div className="p-4 text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs sm:text-sm text-gray-700">30-Day Returns</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`${
                activeTab === 'description'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`${
                activeTab === 'specifications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base`}
            >
              Reviews
            </button>
          </nav>
        </div>
        
        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p>{product.description}</p>
              <p className="mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="mt-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <dl className="divide-y divide-gray-200">
                <div className="grid grid-cols-3 py-4 px-6">
                  <dt className="text-sm font-medium text-gray-500">Brand</dt>
                  <dd className="text-sm text-gray-900 col-span-2">ShopEase</dd>
                </div>
                <div className="grid grid-cols-3 py-4 px-6">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{product.category}</dd>
                </div>
                <div className="grid grid-cols-3 py-4 px-6">
                  <dt className="text-sm font-medium text-gray-500">Warranty</dt>
                  <dd className="text-sm text-gray-900 col-span-2">2 Years</dd>
                </div>
                <div className="grid grid-cols-3 py-4 px-6">
                  <dt className="text-sm font-medium text-gray-500">Material</dt>
                  <dd className="text-sm text-gray-900 col-span-2">Premium Quality</dd>
                </div>
                <div className="grid grid-cols-3 py-4 px-6">
                  <dt className="text-sm font-medium text-gray-500">Shipping</dt>
                  <dd className="text-sm text-gray-900 col-span-2">Free Worldwide Shipping</dd>
                </div>
              </dl>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="text-center py-10">
              <p className="text-gray-500">No reviews yet. Be the first to review this product.</p>
              <Button variant="outline" className="mt-4">
                Write a Review
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;