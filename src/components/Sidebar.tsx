import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  CheckCircle,
  XCircle,
  History,
  AlertTriangle,
  Settings,
  Users,
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold">Motor Risk Assessment</h1>
      </div>
      <nav className="px-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/new"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <FilePlus size={20} />
          <span>New Assessment</span>
        </NavLink>
        <NavLink
          to="/documents"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <FileText size={20} />
          <span>Documents</span>
        </NavLink>
        <NavLink
          to="/inclusions"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <CheckCircle size={20} />
          <span>Inclusions</span>
        </NavLink>
        <NavLink
          to="/exclusions"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <XCircle size={20} />
          <span>Exclusions</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <History size={20} />
          <span>History</span>
        </NavLink>
        <NavLink
          to="/risk-factors"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <AlertTriangle size={20} />
          <span>Risk Factors</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <Users size={20} />
          <span>User Management</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;