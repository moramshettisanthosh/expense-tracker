import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, WalletCards } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 hidden md:block">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <WalletCards /> Tracker
        </h1>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Receipt size={20} /> Expenses
        </NavLink>
        <NavLink
          to="/bills"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <WalletCards size={20} /> Bills
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
