import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  isCurrency = false,
}) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
          {icon}
        </div>
      </div>
      
      <div className="mt-2">
        <p className="text-2xl font-semibold text-gray-900">
          {isCurrency ? formatCurrency(value) : value.toLocaleString()}
        </p>
        
        <div className="flex items-center mt-2">
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
          <span className="text-gray-500 text-sm ml-2">from last month</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;