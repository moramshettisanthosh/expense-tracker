import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Bills from './pages/Bills';
import ReceiptUploadModal from './components/ReceiptUploadModal';

function AppContent() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDataExtracted = (data) => {
    // Navigate to the correct page and pass the extracted data via router state
    if (data.type === 'expense') {
      navigate('/expenses', { state: { scannedData: data } });
    } else {
      navigate('/bills', { state: { scannedData: data } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col w-full min-h-screen">
        <Navbar onOpenScanner={() => setIsScannerOpen(true)} />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/bills" element={<Bills />} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
      <ReceiptUploadModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onDataExtracted={handleDataExtracted}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
