import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <Package className="h-5 w-5" />, label: 'Products', path: '/admin/products' },
    { icon: <ShoppingBag className="h-5 w-5" />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users className="h-5 w-5" />, label: 'Customers', path: '#' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '#' },
  ];
  
  return (
    <div 
      className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`h-16 flex items-center px-4 border-b border-gray-800 ${collapsed ? 'justify-center' : ''}`}>
        {!collapsed && (
          <Link to="/admin" className="text-xl font-bold flex items-center">
            <Package className="h-6 w-6 mr-2 text-blue-500" />
            <span>Admin Panel</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/admin">
            <Package className="h-6 w-6 text-blue-500" />
          </Link>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors`}
              >
                <div className={`${collapsed ? 'mr-0' : 'mr-3'} flex-shrink-0`}>
                  {item.icon}
                </div>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center md:justify-between px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
        >
          {!collapsed && <span>Collapse</span>}
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
        
        <Link to="/" className={`mt-2 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors`}>
          {!collapsed && <span>Back to Store</span>}
          <LogOut className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;