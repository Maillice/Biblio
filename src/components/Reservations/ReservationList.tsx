import React, { useState } from 'react';
import { Search, Plus, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

const ReservationList: React.FC = () => {
  const { reservations, books, members, reserveBook, cancelReservation } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const statuses = ['pending', 'fulfilled', 'cancelled', 'expired'];

  const filteredReservations = reservations.filter(reservation => {
    const book = books.find(b => b.id === reservation.bookId);
    const member = members.find(m => m.id === reservation.memberId);
    
    const matchesSearch = book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book?.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member?.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || reservation.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'fulfilled': return 'Satisfaite';
      case 'cancelled': return 'Annulée';
      case 'expired': return 'Expirée';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'fulfilled': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookId && selectedMemberId) {
      reserveBook(selectedBookId, selectedMemberId);
      setShowReserveModal(false);
      setSelectedBookId('');
      setSelectedMemberId('');
    }
  };

  const availableBooks = books.filter(book => book.status === 'borrowed' || book.availableCopies === 0);
  const activeMembers = members.filter(member => member.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des réservations</h1>
          <p className="text-gray-600">Suivez et gérez les réservations de livres</p>
        </div>
        <button
          onClick={() => setShowReserveModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle réservation</span>
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

      {/* Reservations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReservations.map((reservation) => {
          const book = books.find(b => b.id === reservation.bookId);
          const member = members.find(m => m.id === reservation.memberId);
          
          return (
            <div key={reservation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book?.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{book?.author}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span className="ml-1">{getStatusText(reservation.status)}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      Priorité {reservation.priority}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Membre:</span>
                  <span className="text-gray-900">{member?.firstName} {member?.lastName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date de réservation:</span>
                  <span className="text-gray-900">{reservation.reservationDate.toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Notification:</span>
                  <span className={`text-sm ${reservation.notificationSent ? 'text-green-600' : 'text-gray-500'}`}>
                    {reservation.notificationSent ? 'Envoyée' : 'Non envoyée'}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {reservation.status === 'pending' && (
                  <button
                    onClick={() => cancelReservation(reservation.id)}
                    className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-100 transition-colors flex items-center justify-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                    <span>Annuler</span>
                  </button>
                )}
                <button
                  className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Détails</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReservations.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-lg">📋</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
          <p className="text-gray-600 mb-4">Commencez par créer une nouvelle réservation</p>
          <button
            onClick={() => setShowReserveModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Première réservation
          </button>
        </div>
      )}

      {/* Reserve Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nouvelle réservation</h2>
              
              <form onSubmit={handleReserve} className="space-y-4">
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
                        {book.title} - {book.author} (Indisponible)
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
                    onClick={() => setShowReserveModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Créer la réservation
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

export default ReservationList;