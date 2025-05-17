import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Shield, Truck, CreditCard } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { categories } from '../data/mockData';

const HomePage: React.FC = () => {
  const { products } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Get random products for featured section
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setFeaturedProducts(shuffled.slice(0, 4));
  }, [products]);
  
  const heroImageUrl = "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={heroImageUrl} 
            alt="Modern electronics" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Discover Quality Products <br />
            <span className="text-blue-400">For Every Need</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
            Shop the latest electronics, wearables, and accessories with free shipping and a 30-day money-back guarantee.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors">
              Shop Now
            </Link>
            <Link to="/products" className="inline-block bg-transparent border border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-6 py-3 rounded-md transition-colors">
              View Categories
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center font-medium transition-colors">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.slice(0, 6).map((category, index) => (
              <Link key={index} to={`/products?category=${category}`} className="group">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Package className="h-8 w-8" />
                    </div>
                    <h3 className="font-medium text-gray-900">{category}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">Why Shop With Us</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Truck className="h-8 w-8" />, title: 'Free Shipping', description: 'On all orders over $50' },
              { icon: <Shield className="h-8 w-8" />, title: '2-Year Warranty', description: 'On all products' },
              { icon: <CreditCard className="h-8 w-8" />, title: 'Secure Payment', description: 'Safe & protected checkout' },
              { icon: <Package className="h-8 w-8" />, title: 'Easy Returns', description: '30-day money back guarantee' }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6 max-w-2xl mx-auto">Stay updated with our latest products and exclusive offers.</p>
          <form className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-2 rounded-l-md focus:outline-none text-gray-900"
            />
            <button 
              type="submit" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-r-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;