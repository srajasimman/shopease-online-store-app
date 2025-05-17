import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, Truck, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { Card, CardContent } from '../components/ui/Card';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, placeOrder, getProduct } = useStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: ''
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const subtotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  const estimatedTax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + estimatedTax + shipping;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    };
    let isValid = true;
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
      isValid = false;
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP Code is required';
      isValid = false;
    }
    
    setErrors({
      ...errors,
      ...newErrors
    });
    
    return isValid;
  };
  
  const validateStep2 = () => {
    const newErrors = {
      cardName: '',
      cardNumber: '',
      expDate: '',
      cvv: ''
    };
    let isValid = true;
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
      isValid = false;
    }
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
      isValid = false;
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Invalid card number';
      isValid = false;
    }
    
    if (!formData.expDate.trim()) {
      newErrors.expDate = 'Expiration date is required';
      isValid = false;
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expDate)) {
      newErrors.expDate = 'Invalid format (MM/YY)';
      isValid = false;
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
      isValid = false;
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
      isValid = false;
    }
    
    setErrors({
      ...errors,
      ...newErrors
    });
    
    return isValid;
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep2()) {
      setIsSubmitting(true);
      
      // Simulate order processing
      setTimeout(() => {
        const fullName = `${formData.firstName} ${formData.lastName}`;
        placeOrder(fullName, formData.email);
        navigate('/checkout/success');
        setIsSubmitting(false);
      }, 1500);
    }
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData({
      ...formData,
      cardNumber: formattedValue
    });
    
    if (errors.cardNumber) {
      setErrors({
        ...errors,
        cardNumber: ''
      });
    }
  };
  
  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    setFormData({
      ...formData,
      expDate: value
    });
    
    if (errors.expDate) {
      setErrors({
        ...errors,
        expDate: ''
      });
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/cart" className="hover:text-blue-600">Cart</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-700">Checkout</span>
      </div>
      
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      {/* Checkout Progress */}
      <div className="mb-8">
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex text-xs sm:text-sm justify-between -mx-1.5">
            <div className="w-1/3 px-1">
              <div className={`${step >= 1 ? 'text-blue-600' : 'text-gray-500'} flex flex-col items-center`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${step >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                  {step > 1 ? <Check className="h-4 w-4" /> : 1}
                </div>
                <span>Shipping</span>
              </div>
            </div>
            <div className="w-1/3 px-1">
              <div className={`${step >= 2 ? 'text-blue-600' : 'text-gray-500'} flex flex-col items-center`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${step >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                  {step > 2 ? <Check className="h-4 w-4" /> : 2}
                </div>
                <span>Payment</span>
              </div>
            </div>
            <div className="w-1/3 px-1">
              <div className={`${step >= 3 ? 'text-blue-600' : 'text-gray-500'} flex flex-col items-center`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${step >= 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                  3
                </div>
                <span>Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <div>
                    <div className="flex items-center mb-4">
                      <Truck className="h-5 w-5 text-blue-600 mr-2" />
                      <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        fullWidth
                      />
                      <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        fullWidth
                      />
                    </div>
                    
                    <div className="mb-6">
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        fullWidth
                      />
                    </div>
                    
                    <div className="mb-6">
                      <Input
                        label="Street Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                        fullWidth
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        error={errors.city}
                        fullWidth
                      />
                      <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        error={errors.state}
                        fullWidth
                      />
                      <Input
                        label="ZIP Code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        error={errors.zipCode}
                        fullWidth
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 2: Payment Information */}
                {step === 2 && (
                  <div>
                    <div className="flex items-center mb-4">
                      <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                      <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
                    </div>
                    
                    <div className="mb-6">
                      <Input
                        label="Name on Card"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        error={errors.cardName}
                        fullWidth
                      />
                    </div>
                    
                    <div className="mb-6">
                      <Input
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        error={errors.cardNumber}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        fullWidth
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiration Date (MM/YY)"
                        name="expDate"
                        value={formData.expDate}
                        onChange={handleExpDateChange}
                        error={errors.expDate}
                        placeholder="MM/YY"
                        maxLength={5}
                        fullWidth
                      />
                      <Input
                        label="CVV"
                        name="cvv"
                        type="password"
                        value={formData.cvv}
                        onChange={handleChange}
                        error={errors.cvv}
                        maxLength={4}
                        fullWidth
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 3: Review Order */}
                {step === 3 && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Review Your Order</h2>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-700 mb-2">Shipping Information</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.email}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
                      <div className="bg-gray-50 p-4 rounded-md flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                        <div>
                          <p>Credit Card ending in {formData.cardNumber.slice(-4)}</p>
                          <p className="text-sm text-gray-500">Expires {formData.expDate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Order Items</h3>
                      <div className="bg-gray-50 rounded-md overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {cart.map((item) => {
                            const product = getProduct(item.productId);
                            return product ? (
                              <li key={item.productId} className="p-4 flex items-center">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                                <div className="ml-4 flex-grow">
                                  <p className="font-medium text-gray-900">{product.name}</p>
                                  <p className="text-gray-500 text-sm">{item.quantity} x {formatCurrency(item.price)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-8 flex justify-between">
                  {step > 1 ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handlePrevStep}
                    >
                      Back
                    </Button>
                  ) : (
                    <Link to="/cart">
                      <Button variant="outline">
                        Back to Cart
                      </Button>
                    </Link>
                  )}
                  
                  {step < 3 ? (
                    <Button 
                      type="button"
                      onClick={handleNextStep}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button 
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Place Order
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
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
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mt-6">
                <p className="mb-2 flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-blue-600" />
                  {shipping === 0 ? 'Free shipping' : 'Standard shipping'}
                </p>
                <p className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-blue-600" />
                  Secure checkout
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;