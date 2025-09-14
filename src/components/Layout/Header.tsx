import React from 'react';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-gray-800 border-b border-gray-700 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          className="block md:hidden text-gray-400 hover:text-white mr-4"
          onClick={() => document.documentElement.classList.toggle('sidebar-open')}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">Distribuição</h1>
      </div>

      <div className="relative">
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
            <UserIcon size={16} />
          </div>
          <span className="hidden md:block">{user?.name}</span>
        </div>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
            <div className="p-4 border-b border-gray-700">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <p className="text-sm text-gray-400 capitalize">{user?.type} - {user?.role}</p>
            </div>
            <div className="p-2">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded flex items-center"
                onClick={logout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};