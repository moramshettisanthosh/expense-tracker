import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, Plus, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', amount: '', due_date: '', status: 'unpaid' });

  const location = useLocation();
  const navigate = useNavigate();

  // Check if we came from AI Scanner
  useEffect(() => {
    if (location.state?.scannedData) {
      const { title, amount, date } = location.state.scannedData;
      setFormData({
        name: title || '',
        amount: amount || '',
        due_date: date || new Date().toISOString().split('T')[0],
        status: 'unpaid'
      });
      setShowModal(true);
      
      // Clear the state
      navigate('/bills', { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/bills');
      setBills(data);
    } catch (error) {
      toast.error('Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/bills/${editingId}`, formData);
        toast.success('Bill updated successfully');
      } else {
        await api.post('/bills', formData);
        toast.success('Bill added successfully');
      }
      setShowModal(false);
      setFormData({ name: '', amount: '', due_date: '', status: 'unpaid' });
      setEditingId(null);
      fetchBills();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/bills/${id}`);
        toast.success('Bill deleted');
        fetchBills();
      } catch (error) {
        toast.error('Failed to delete bill');
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
      await api.patch(`/bills/${id}/status`, { status: newStatus });
      toast.success(`Bill marked as ${newStatus}`);
      fetchBills();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openEditModal = (bill) => {
    setFormData({
      name: bill.name,
      amount: bill.amount,
      due_date: bill.due_date.split('T')[0],
      status: bill.status
    });
    setEditingId(bill.id);
    setShowModal(true);
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? bill.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const today = new Date();
  today.setHours(0,0,0,0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Bills Management</h1>
        <button 
          onClick={() => {
            setFormData({ name: '', amount: '', due_date: '', status: 'unpaid' });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Bill
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search bills..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[150px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Bill Name</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredBills.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No bills found</td></tr>
              ) : (
                filteredBills.map(bill => {
                  const dueDate = new Date(bill.due_date);
                  const isOverdue = dueDate < today && bill.status === 'unpaid';
                  
                  return (
                    <tr key={bill.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${isOverdue ? 'bg-red-50/30' : ''}`}>
                      <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                        {bill.name}
                        {isOverdue && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">OVERDUE</span>}
                      </td>
                      <td className="p-4 text-gray-600">₹{Number(bill.amount).toLocaleString()}</td>
                      <td className={`p-4 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {dueDate.toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => toggleStatus(bill.id, bill.status)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            bill.status === 'paid' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                        >
                          {bill.status === 'paid' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                        </button>
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        <button onClick={() => openEditModal(bill)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(bill.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Bill' : 'Add Bill'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Name</label>
                <input required type="text" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input required type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input required type="date" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg bg-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
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

export default Bills;
