export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  createdAt: Date;
}

export interface SalesMetric {
  label: string;
  value: number;
  previousValue: number;
  change: number;
}

export interface SalesByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface TimelineData {
  date: string;
  sales: number;
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
};