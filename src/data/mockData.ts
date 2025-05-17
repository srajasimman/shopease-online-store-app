import { Product, Order, SalesMetric, SalesByCategory, TimelineData } from '../types';

// Mock product data
export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High quality wireless headphones with noise cancellation.',
    price: 299.99,
    inventory: 25,
    image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Electronics',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Ultra Slim Laptop',
    description: 'Powerful and portable laptop for professionals.',
    price: 1299.99,
    inventory: 10,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Electronics',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-20'),
  },
  {
    id: '3',
    name: 'Smart Watch Series 5',
    description: 'Track your fitness and stay connected with this smartwatch.',
    price: 249.99,
    inventory: 30,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Wearables',
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-05'),
  },
  {
    id: '4',
    name: 'Designer Leather Backpack',
    description: 'Stylish and durable backpack for everyday use.',
    price: 149.99,
    inventory: 15,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Accessories',
    createdAt: new Date('2023-04-12'),
    updatedAt: new Date('2023-04-12'),
  },
  {
    id: '5',
    name: 'Professional DSLR Camera',
    description: 'Capture stunning photos with this high-end camera.',
    price: 899.99,
    inventory: 8,
    image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Photography',
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2023-05-25'),
  },
  {
    id: '6',
    name: 'Wireless Charging Pad',
    description: 'Convenient wireless charging for your devices.',
    price: 39.99,
    inventory: 50,
    image: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Electronics',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15'),
  }
];

// Mock order data
export const orders: Order[] = [
  {
    id: '1',
    items: [
      { productId: '1', quantity: 2, price: 299.99 },
      { productId: '3', quantity: 1, price: 249.99 }
    ],
    totalAmount: 849.97,
    status: 'completed',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    createdAt: new Date('2023-06-10')
  },
  {
    id: '2',
    items: [
      { productId: '2', quantity: 1, price: 1299.99 }
    ],
    totalAmount: 1299.99,
    status: 'completed',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    createdAt: new Date('2023-06-12')
  },
  {
    id: '3',
    items: [
      { productId: '4', quantity: 1, price: 149.99 },
      { productId: '6', quantity: 2, price: 39.99 }
    ],
    totalAmount: 229.97,
    status: 'pending',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    createdAt: new Date('2023-06-15')
  },
  {
    id: '4',
    items: [
      { productId: '5', quantity: 1, price: 899.99 }
    ],
    totalAmount: 899.99,
    status: 'completed',
    customerName: 'Sarah Williams',
    customerEmail: 'sarah@example.com',
    createdAt: new Date('2023-06-18')
  }
];

// Mock sales metrics
export const salesMetrics: SalesMetric[] = [
  {
    label: 'Total Sales',
    value: 15789.50,
    previousValue: 12450.75,
    change: 26.8
  },
  {
    label: 'Orders',
    value: 156,
    previousValue: 132,
    change: 18.2
  },
  {
    label: 'Customers',
    value: 89,
    previousValue: 76,
    change: 17.1
  },
  {
    label: 'Avg. Order Value',
    value: 101.21,
    previousValue: 94.32,
    change: 7.3
  }
];

// Mock sales by category
export const salesByCategory: SalesByCategory[] = [
  { category: 'Electronics', amount: 8954.23, percentage: 56.7 },
  { category: 'Wearables', amount: 2531.85, percentage: 16.0 },
  { category: 'Accessories', amount: 1845.65, percentage: 11.7 },
  { category: 'Photography', amount: 2457.77, percentage: 15.6 }
];

// Mock timeline data
export const timelineData: TimelineData[] = [
  { date: 'Jan', sales: 4200 },
  { date: 'Feb', sales: 3800 },
  { date: 'Mar', sales: 5100 },
  { date: 'Apr', sales: 4800 },
  { date: 'May', sales: 5300 },
  { date: 'Jun', sales: 5800 },
  { date: 'Jul', sales: 6100 },
  { date: 'Aug', sales: 5900 },
  { date: 'Sep', sales: 6300 },
  { date: 'Oct', sales: 6700 },
  { date: 'Nov', sales: 7200 },
  { date: 'Dec', sales: 8500 }
];

export const categories = [
  'Electronics',
  'Wearables',
  'Accessories',
  'Photography',
  'Clothing',
  'Home & Kitchen'
];

export const currentUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
};