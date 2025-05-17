import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';

interface CartItemProps {
  productId: string;
  quantity: number;
  price: number;
}

const CartItem: React.FC<CartItemProps> = ({ productId, quantity, price }) => {
  const { getProduct, updateCartItemQuantity, removeFromCart } = useStore();
  
  const product = getProduct(productId);
  
  if (!product) {
    return null;
  }
  
  const handleIncrement = () => {
    if (product.inventory > quantity) {
      updateCartItemQuantity(productId, quantity + 1);
    }
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      updateCartItemQuantity(productId, quantity - 1);
    } else {
      removeFromCart(productId);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(productId);
  };
  
  const itemTotal = price * quantity;
  
  return (
    <div className="flex py-6 border-b border-gray-200">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover object-center"
        />
      </div>
      
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{product.name}</h3>
            <p className="ml-4">{formatCurrency(itemTotal)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button 
              onClick={handleDecrement}
              className="p-1 text-gray-600 hover:text-gray-900"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-2 py-1 min-w-[40px] text-center font-medium">{quantity}</span>
            <button 
              onClick={handleIncrement}
              className="p-1 text-gray-600 hover:text-gray-900"
              disabled={product.inventory <= quantity}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex">
            <button 
              type="button" 
              onClick={handleRemove}
              className="text-red-600 hover:text-red-800 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;