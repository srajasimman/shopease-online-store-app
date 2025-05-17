import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Button from './ui/Button';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inventory: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, category, inventory }) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, 1);
  };

  return (
    <Link to={`/products/${id}`} className="group">
      <div className="relative bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 group-hover:opacity-85 transition-opacity">
          <img
            src={image}
            alt={name}
            className="h-48 w-full object-cover object-center"
          />
          <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 px-2 py-1 rounded-full text-xs text-white">
            {category}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(price)}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              {inventory > 0 ? (
                inventory < 5 ? (
                  <span className="text-orange-600">Only {inventory} left</span>
                ) : (
                  <span>In Stock</span>
                )
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>
          
          <div className="mt-3">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              disabled={inventory === 0}
              onClick={handleAddToCart}
              className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;