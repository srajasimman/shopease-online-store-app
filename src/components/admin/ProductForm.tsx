import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { categories } from '../../data/mockData';
import { Product } from '../../types';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isSubmitting?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  initialData, 
  onSubmit,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    inventory: initialData?.inventory || 0,
    image: initialData?.image || '',
    category: initialData?.category || categories[0]
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    inventory: '',
    image: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({
      ...formData,
      price: isNaN(value) ? 0 : value
    });
    
    if (errors.price) {
      setErrors({
        ...errors,
        price: ''
      });
    }
  };

  const handleInventoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      inventory: isNaN(value) ? 0 : value
    });
    
    if (errors.inventory) {
      setErrors({
        ...errors,
        inventory: ''
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value
    });
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      price: '',
      inventory: '',
      image: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
      isValid = false;
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
      isValid = false;
    }

    if (formData.inventory < 0) {
      newErrors.inventory = 'Inventory cannot be negative';
      isValid = false;
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Product image URL is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            fullWidth
            required
          />
          
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            rows={5}
            fullWidth
            required
          />
          
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            options={categories.map(category => ({ value: category, label: category }))}
            fullWidth
          />
        </div>
        
        <div className="space-y-6">
          <Input
            label="Price ($)"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.price.toString()}
            onChange={handlePriceChange}
            error={errors.price}
            fullWidth
            required
          />
          
          <Input
            label="Inventory"
            name="inventory"
            type="number"
            min="0"
            step="1"
            value={formData.inventory.toString()}
            onChange={handleInventoryChange}
            error={errors.inventory}
            fullWidth
            required
          />
          
          <Input
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            error={errors.image}
            fullWidth
            required
          />
          
          {formData.image && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <div className="border border-gray-200 rounded-md overflow-hidden h-48">
                <img 
                  src={formData.image} 
                  alt="Product preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;