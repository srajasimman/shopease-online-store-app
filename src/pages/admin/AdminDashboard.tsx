import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Calendar,
  BarChart4,
  PieChart
} from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import StatCard from '../../components/admin/StatCard';
import OrdersTable from '../../components/admin/OrdersTable';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useStore } from '../../context/StoreContext';
import { salesMetrics, salesByCategory, timelineData } from '../../data/mockData';
import Button from '../../components/ui/Button';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard: React.FC = () => {
  const { orders } = useStore();
  const [timeRange, setTimeRange] = useState('lastMonth');
  
  // Sales Overview Chart Data
  const salesChartData = {
    labels: timelineData.map(item => item.date),
    datasets: [
      {
        label: 'Sales',
        data: timelineData.map(item => item.sales),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  // Sales by Category Chart Data
  const categoryChartData = {
    labels: salesByCategory.map(item => item.category),
    datasets: [
      {
        label: 'Sales by Category',
        data: salesByCategory.map(item => item.amount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(99, 102, 241, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Orders by Status Chart Data
  const orderStatusCounts = {
    completed: orders.filter(order => order.status === 'completed').length,
    pending: orders.filter(order => order.status === 'pending').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length,
  };
  
  const orderStatusChartData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        label: 'Orders by Status',
        data: [
          orderStatusCounts.completed,
          orderStatusCounts.pending,
          orderStatusCounts.cancelled,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Format date for header
  const currentDate = format(new Date(), 'MMMM d, yyyy');
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600">{currentDate}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button 
            variant={timeRange === 'lastWeek' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('lastWeek')}
          >
            Last Week
          </Button>
          <Button 
            variant={timeRange === 'lastMonth' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('lastMonth')}
          >
            Last Month
          </Button>
          <Button 
            variant={timeRange === 'lastYear' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('lastYear')}
          >
            Last Year
          </Button>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Sales" 
          value={salesMetrics[0].value} 
          change={salesMetrics[0].change} 
          icon={<DollarSign className="h-5 w-5" />}
          isCurrency
        />
        <StatCard 
          title="Total Orders" 
          value={salesMetrics[1].value} 
          change={salesMetrics[1].change} 
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <StatCard 
          title="Total Customers" 
          value={salesMetrics[2].value} 
          change={salesMetrics[2].change} 
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard 
          title="Avg. Order Value" 
          value={salesMetrics[3].value} 
          change={salesMetrics[3].change} 
          icon={<TrendingUp className="h-5 w-5" />}
          isCurrency
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center">
                <BarChart4 className="h-5 w-5 mr-2 text-blue-600" />
                Sales Overview
              </CardTitle>
              <div className="text-sm text-gray-500">
                <Calendar className="h-4 w-4 inline mr-1" />
                {timeRange === 'lastWeek' ? 'Last 7 days' : 
                  timeRange === 'lastMonth' ? 'Last 30 days' : 'Last 12 months'}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 md:h-72">
              <Line
                data={salesChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-medium flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-600" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <Pie
                data={categoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Order Status and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-medium">Order Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <Bar
                data={orderStatusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <OrdersTable orders={orders} limit={5} />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;