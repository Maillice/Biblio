import React, { useState } from 'react';
import { Search, Plus, RotateCcw, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

const BorrowList: React.FC = () => {
  const { borrows, books, members, returnBook, renewBook, borrowBook } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const statuses = ['active', 'returned', 'overdue'];

  const filteredBorrows = borrows.filter(borrow => {
    const book = books.find(b => b.id === borrow.bookId);
    const member = members.find(m => m.id === borrow.memberId);
    
    const matchesSearch = book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book?.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member?.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || borrow.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'returned': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'returned': return 'Retourné';
      case 'overdue': return 'En retard';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'returned': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookId && selectedMemberId) {
      borrowBook(selectedBookId, selectedMemberId);
      setShowBorrowModal(false);
      setSelectedBookId('');
      setSelectedMemberId('');
    }
  };

  const availableBooks = books.filter(book => book.availableCopies > 0);
  const activeMembers = members.filter(member => member.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des emprunts</h1>
          <p className="text-gray-600">Suivez les emprunts et retours</p>
        </div>
        <button
          onClick={() => setShowBorrowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvel emprunt</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par livre ou membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            {statuses.map(status => (
              <option key={status} value={status}>{getStatusText(status)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Borrows Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'emprunt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'échéance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pénalité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBorrows.map((borrow) => {
                const book = books.find(b => b.id === borrow.bookId);
                const member = members.find(m => m.id === borrow.memberId);
                
                return (
                  <tr key={borrow.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{book?.title}</div>
                        <div className="text-sm text-gray-500">{book?.author}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member?.firstName} {member?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{member?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {borrow.borrowDate.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {borrow.dueDate.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(borrow.status)}`}>
                        {getStatusIcon(borrow.status)}
                        <span className="ml-1">{getStatusText(borrow.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {borrow.penalty > 0 ? `${borrow.penalty}€` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {borrow.status === 'active' && (
                          <>
                            <button
                              onClick={() => returnBook(borrow.id)}
                              className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded text-xs"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            {borrow.renewalCount < 2 && (
                              <button
                                onClick={() => renewBook(borrow.id)}
                                className="text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded text-xs"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBorrows.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-lg">📚</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun emprunt trouvé</h3>
          <p className="text-gray-600 mb-4">Commencez par créer un nouvel emprunt</p>
          <button
            onClick={() => setShowBorrowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Premier emprunt
          </button>
        </div>
      )}

      {/* Borrow Modal */}
      {showBorrowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nouvel emprunt</h2>
              
              <form onSubmit={handleBorrow} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Livre
                  </label>
                  <select
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un livre</option>
                    {availableBooks.map(book => (
                      <option key={book.id} value={book.id}>
                        {book.title} - {book.author} ({book.availableCopies} disponibles)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membre
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un membre</option>
                    {activeMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.firstName} {member.lastName} ({member.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowBorrowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Créer l'emprunt
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowList;