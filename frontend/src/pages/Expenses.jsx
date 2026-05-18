import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', category: '', date: '' });

  const location = useLocation();
  const navigate = useNavigate();

  // Check if we came from AI Scanner
  useEffect(() => {
    if (location.state?.scannedData) {
      const { title, amount, category, date } = location.state.scannedData;
      setFormData({
        title: title || '',
        amount: amount || '',
        category: category || 'Other',
        date: date || new Date().toISOString().split('T')[0]
      });
      setShowModal(true);
      
      // Clear the state so it doesn't reopen on refresh
      navigate('/expenses', { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter]);

  const fetchExpenses = async () => {
    try {
      const url = categoryFilter ? `/expenses?category=${categoryFilter}` : '/expenses';
      const { data } = await api.get(url);
      setExpenses(data);
    } catch (error) {
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, formData);
        toast.success('Expense updated successfully');
      } else {
        await api.post('/expenses', formData);
        toast.success('Expense added successfully');
      }
      setShowModal(false);
      setFormData({ title: '', amount: '', category: '', date: '' });
      setEditingId(null);
      fetchExpenses();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        toast.success('Expense deleted');
        fetchExpenses();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const openEditModal = (expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.split('T')[0]
    });
    setEditingId(expense.id);
    setShowModal(true);
  };

  const filteredExpenses = expenses.filter(expense => 
    expense.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Medical', 'Other'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        <button 
          onClick={() => {
            setFormData({ title: '', amount: '', category: '', date: '' });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Expense
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search expenses..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[150px]"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredExpenses.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No expenses found</td></tr>
              ) : (
                filteredExpenses.map(expense => (
                  <tr key={expense.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{expense.title}</td>
                    <td className="p-4 text-gray-600">₹{Number(expense.amount).toLocaleString()}</td>
                    <td className="p-4">
                      <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => openEditModal(expense)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(expense.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input required type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select required className="w-full p-2 border border-gray-300 rounded-lg bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="" disabled>Select category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input required type="date" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
