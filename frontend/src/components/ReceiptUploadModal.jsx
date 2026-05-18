import { useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ReceiptUploadModal = ({ isOpen, onClose, onDataExtracted }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an image first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const { data } = await api.post('/upload-receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(`Successfully analyzed as ${data.type}!`);
      onDataExtracted(data); // Pass data to parent to open the correct form
      onClose();
      setFile(null);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error analyzing receipt. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-2">Scan Receipt with AI</h2>
        <p className="text-gray-600 mb-6 text-sm">Upload a picture of a bill or receipt and our AI will automatically extract the amount, date, and category for you.</p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 mb-6 relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={loading}
          />
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <UploadCloud size={48} className="text-indigo-400 mb-4" />
            <p className="font-medium text-gray-700">
              {file ? file.name : 'Click or drag image to upload'}
            </p>
            {!file && <p className="text-xs text-gray-500 mt-2">Supports JPG, PNG (Max 5MB)</p>}
          </div>
        </div>

        <button 
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Analyzing Image...
            </>
          ) : (
            'Scan & Extract Data'
          )}
        </button>
      </div>
    </div>
  );
};

export default ReceiptUploadModal;
