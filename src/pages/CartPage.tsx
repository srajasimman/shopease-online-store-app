import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Trash2, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import CartItem from '../components/CartItem';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { Card, CardContent, CardFooter } from '../components/ui/Card';

const CartPage: React.FC = () => {
  const { cart, clearCart, getProduct } = useStore();
  
  const cartIsEmpty = cart.length === 0;
  
  const subtotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  const estimatedTax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + estimatedTax + shipping;
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };
  
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-700">Shopping Cart</span>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Shopping Cart
          {!cartIsEmpty && (
            <span className="ml-2 text-lg text-gray-500">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          )}
        </h1>
        
        {!cartIsEmpty && (
          <button 
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear Cart
          </button>
        )}
      </div>
      
      {cartIsEmpty ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products">
            <Button>
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <CartItem 
                    key={item.productId}
                    productId={item.productId}
                    quantity={item.quantity}
                    price={item.price}
                  />
                ))}
              </CardContent>
              <CardFooter className="border-t border-gray-200 bg-gray-50 p-4">
                <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                  <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                  Continue Shopping
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Tax</span>
                    <span className="font-medium">{formatCurrency(estimatedTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between text-base font-medium">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{formatCurrency(total)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {shipping === 0 ? 
                        'Including free shipping' : 
                        `Add ${formatCurrency(100 - subtotal)} more for free shipping`
                      }
                    </p>
                  </div>
                </div>
                
                <Link to="/checkout">
                  <Button fullWidth>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;