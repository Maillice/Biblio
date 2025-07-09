import React, { useState } from 'react';
import { LibraryProvider } from './contexts/LibraryContext';
import { useLibrary } from './contexts/LibraryContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import LoadingSpinner from './components/Layout/LoadingSpinner';
import ErrorMessage from './components/Layout/ErrorMessage';
import Dashboard from './components/Dashboard/Dashboard';
import BookList from './components/Books/BookList';
import BookForm from './components/Books/BookForm';
import MemberList from './components/Members/MemberList';
import BorrowList from './components/Borrows/BorrowList';
import ReservationList from './components/Reservations/ReservationList';
import Reports from './components/Reports/Reports';
import ActivityLog from './components/Activity/ActivityLog';

const AppContent: React.FC = () => {
  const { loading, error } = useLibrary();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement de la bibliothèque..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return (
          <>
            <BookList />
            <BookForm 
              isOpen={showBookForm}
              onClose={() => {
                setShowBookForm(false);
                setEditingBook(null);
              }}
              book={editingBook}
            />
          </>
        );
      case 'members':
        return <MemberList />;
      case 'borrows':
        return <BorrowList />;
      case 'reservations':
        return <ReservationList />;
      case 'reports':
        return <Reports />;
      case 'activity':
        return <ActivityLog />;
      case 'users':
        return <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Gestion des utilisateurs</h2>
          <p className="text-gray-600">Module de gestion des utilisateurs en cours de développement...</p>
        </div>;
      case 'settings':
        return <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres</h2>
          <p className="text-gray-600">Module de paramètres en cours de développement...</p>
        </div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 ml-64">
        <Header />
        <main className="pt-20 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
}

export default App;