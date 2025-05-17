import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const OrderManagement: React.FC = () => {
  const { orders, getProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Order>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  
  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => 
      (searchTerm === '' || 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.includes(searchTerm)) &&
      (statusFilter === '' || order.status === statusFilter)
    )
    .sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      
      if (valueA instanceof Date && valueB instanceof Date) {
        return sortDirection === 'asc' 
          ? valueA.getTime() - valueB.getTime() 
          : valueB.getTime() - valueA.getTime();
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        // Handle number comparison
        const numA = Number(valueA);
        const numB = Number(valueB);
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
    });
  
  const handleSort = (column: keyof Order) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prevExpanded => 
      prevExpanded.includes(orderId)
        ? prevExpanded.filter(id => id !== orderId)
        : [...prevExpanded, orderId]
    );
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };
  
  const updateOrderStatus = (orderId: string, status: 'pending' | 'completed' | 'cancelled') => {
    // In a real application, this would call an API to update the order status
    console.log(`Updating order ${orderId} to ${status}`);
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by customer name, email or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters {statusFilter && '(1)'}
            </Button>
            
            <Select
              options={[
                { value: 'All', label: `All Orders (${orders.length})` },
                { value: 'Recent', label: 'Recent Orders' }
              ]}
              value="All"
              onChange={() => {}}
            />
          </div>
        </div>
        
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">Filters</h3>
              {statusFilter && (
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Select
                  label="Status"
                  options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' }
                  ]}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('id')}
                    className="group flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Order ID</span>
                    {sortColumn === 'id' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-gray-500" />
                      )
                    ) : (
                      <div className="h-4 w-4 opacity-0 group-hover:opacity-100">
                        <ArrowUp className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('customerName')}
                    className="group flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Customer</span>
                    {sortColumn === 'customerName' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-gray-500" />
                      )
                    ) : (
                      <div className="h-4 w-4 opacity-0 group-hover:opacity-100">
                        <ArrowUp className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="group flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Date</span>
                    {sortColumn === 'createdAt' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-gray-500" />
                      )
                    ) : (
                      <div className="h-4 w-4 opacity-0 group-hover:opacity-100">
                        <ArrowUp className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('totalAmount')}
                    className="group flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Total</span>
                    {sortColumn === 'totalAmount' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-gray-500" />
                      )
                    ) : (
                      <div className="h-4 w-4 opacity-0 group-hover:opacity-100">
                        <ArrowUp className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('status')}
                    className="group flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Status</span>
                    {sortColumn === 'status' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-gray-500" />
                      )
                    ) : (
                      <div className="h-4 w-4 opacity-0 group-hover:opacity-100">
                        <ArrowUp className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className={`hover:bg-gray-50 ${expandedOrders.includes(order.id) ? 'bg-gray-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        <ChevronDown 
                          className={`h-5 w-5 transform transition-transform ${
                            expandedOrders.includes(order.id) ? 'rotate-180' : 'rotate-0'
                          }`} 
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'cancelled' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end">
                        <Select
                          options={[
                            { value: 'pending', label: 'Mark as Pending' },
                            { value: 'completed', label: 'Mark as Completed' },
                            { value: 'cancelled', label: 'Mark as Cancelled' }
                          ]}
                          value=""
                          onChange={(status) => updateOrderStatus(order.id, status as any)}
                          className="text-sm"
                        />
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Order Details */}
                  {expandedOrders.includes(order.id) && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="text-sm">
                          <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                  </th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                  </th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                  </th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {order.items.map((item, idx) => {
                                  const product = getProduct(item.productId);
                                  return (
                                    <tr key={idx}>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                          {product ? (
                                            <>
                                              <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt="" />
                                              </div>
                                              <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                              </div>
                                            </>
                                          ) : (
                                            <div className="text-sm text-gray-500">Product not found</div>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {formatCurrency(item.price)}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {item.quantity}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {formatCurrency(item.price * item.quantity)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                              <tfoot className="bg-gray-50">
                                <tr>
                                  <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                    Order Total:
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                    {formatCurrency(order.totalAmount)}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
            {(searchTerm || statusFilter) && (
              <Button onClick={handleClearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
        
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredOrders.length}</span> of{' '}
                <span className="font-medium">{filteredOrders.length}</span> orders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;