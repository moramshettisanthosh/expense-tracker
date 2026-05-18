import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { IndianRupee, ReceiptText, TrendingUp, AlertCircle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resExpenses, resBills] = await Promise.all([
        api.get('/expenses'),
        api.get('/bills')
      ]);
      setExpenses(resExpenses.data);
      setBills(resBills.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalBillsDue = bills.filter(b => b.status === 'unpaid').reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  // Expenses by Category (Pie Chart)
  const expensesByCategory = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Monthly Expenses (Bar Chart)
  const monthlyData = expenses.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Expenses',
        data: Object.values(monthlyData),
        backgroundColor: '#6366f1',
        borderRadius: 4,
      },
    ],
  };

  // Upcoming Bills (Next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingBills = bills.filter(bill => {
    const dueDate = new Date(bill.due_date);
    return bill.status === 'unpaid' && dueDate >= today && dueDate <= nextWeek;
  });

  if (loading) return <div className="flex items-center justify-center h-full">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
            <h3 className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-500 rounded-xl">
            <ReceiptText size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Bills Due</p>
            <h3 className="text-2xl font-bold text-gray-900">₹{totalBillsDue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-500 rounded-xl">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Upcoming Bills (7 days)</p>
            <h3 className="text-2xl font-bold text-gray-900">{upcomingBills.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Expenses</h3>
          <div className="h-64">
            {Object.keys(monthlyData).length > 0 ? (
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="text-gray-500 flex items-center justify-center h-full">No expenses to display</p>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Expenses by Category</h3>
          <div className="h-64 flex justify-center">
            {Object.keys(expensesByCategory).length > 0 ? (
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="text-gray-500 flex items-center justify-center h-full">No expenses to display</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
