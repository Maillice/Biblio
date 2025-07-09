import React from 'react';
import { 
  BookOpen, 
  Users, 
  ArrowRightLeft, 
  Calendar, 
  BarChart3, 
  Settings, 
  History,
  UserCheck
} from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { currentUser } = useLibrary();
  
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'books', label: 'Livres', icon: BookOpen },
    { id: 'members', label: 'Membres', icon: Users },
    { id: 'borrows', label: 'Emprunts', icon: ArrowRightLeft },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'reports', label: 'Rapports', icon: BarChart3 },
    { id: 'activity', label: 'Activité', icon: History },
    ...(currentUser?.role === 'admin' ? [{ id: 'users', label: 'Utilisateurs', icon: UserCheck }] : []),
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">BiblioTech</h1>
            <p className="text-sm text-gray-500">Gestion de bibliothèque</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {currentUser?.firstName.charAt(0)}{currentUser?.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;