import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';
import { useStore } from '../../context/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, updateProduct } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const product = getProduct(id || '');
  
  useEffect(() => {
    if (!product) {
      navigate('/admin/products');
    }
  }, [product, navigate]);
  
  if (!product) {
    return null;
  }
  
  const handleSubmit = (formData: any) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      updateProduct({
        ...product,
        ...formData
      });
      setIsSubmitting(false);
      navigate('/admin/products');
    }, 1000);
  };
  
  return (
    <div>
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Link to="/admin" className="hover:text-blue-600">Dashboard</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/admin/products" className="hover:text-blue-600">Products</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-700">Edit Product</span>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>
      
      <Card>
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-lg font-medium">Edit Product Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ProductForm 
            initialData={product} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;