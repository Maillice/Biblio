import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

const Header: React.FC = () => {
  const { currentUser, logout, statistics } = useLibrary();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-64 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quick stats */}
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">{statistics.activeBorrows}</div>
                <div className="text-gray-500">Emprunts actifs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-amber-600">{statistics.overdueBooks}</div>
                <div className="text-gray-500">En retard</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">{statistics.pendingReservations}</div>
                <div className="text-gray-500">Réservations</div>
              </div>
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {currentUser?.firstName} {currentUser?.lastName}
                </div>
                <div className="text-xs text-gray-500 capitalize">{currentUser?.role}</div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;