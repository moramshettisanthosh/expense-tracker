import { Menu, ScanLine } from 'lucide-react';

const Navbar = ({ toggleSidebar, onOpenScanner }) => {
  return (
    <div className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-8 justify-between sticky top-0 z-10 w-full">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="p-2 mr-4 md:hidden text-gray-600 hover:bg-gray-100 rounded-lg">
          <Menu size={24} />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenScanner}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
        >
          <ScanLine size={18} />
          <span className="hidden sm:inline">Scan Receipt</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
          U
        </div>
      </div>
    </div>
  );
};

export default Navbar;
