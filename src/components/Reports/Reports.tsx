import React, { useState } from 'react';
import { FileText, Download, TrendingUp, Users, BookOpen, Calendar } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

const Reports: React.FC = () => {
  const { statistics, books, members, borrows, reservations } = useLibrary();
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportTypes = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'books', label: 'Rapport des livres', icon: BookOpen },
    { id: 'members', label: 'Rapport des membres', icon: Users },
    { id: 'borrows', label: 'Rapport d\'emprunts', icon: FileText },
    { id: 'reservations', label: 'Rapport des réservations', icon: Calendar }
  ];

  const renderOverviewReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-semibold">Total des livres</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.totalBooks}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-semibold">Membres actifs</p>
              <p className="text-2xl font-bold text-green-900">{statistics.totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-semibold">Emprunts actifs</p>
              <p className="text-2xl font-bold text-purple-900">{statistics.activeBorrows}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-amber-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 font-semibold">Réservations</p>
              <p className="text-2xl font-bold text-amber-900">{statistics.pendingReservations}</p>
            </div>
            <Calendar className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Livres les plus populaires</h3>
          <div className="space-y-3">
            {statistics.popularBooks.map((book, index) => (
              <div key={book.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{book.totalCopies} copies</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Membres les plus actifs</h3>
          <div className="space-y-3">
            {statistics.activeMembers.map((member, index) => (
              <div key={member.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{member.totalBorrows} emprunts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBooksReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-600 font-semibold">Total des livres</p>
          <p className="text-2xl font-bold text-blue-900">{books.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-green-600 font-semibold">Livres disponibles</p>
          <p className="text-2xl font-bold text-green-900">
            {books.filter(b => b.status === 'available').length}
          </p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="text-red-600 font-semibold">Livres empruntés</p>
          <p className="text-2xl font-bold text-red-900">
            {books.filter(b => b.status === 'borrowed').length}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Inventaire des livres</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponibles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{book.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.totalCopies}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.availableCopies}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      book.status === 'available' ? 'bg-green-100 text-green-800' :
                      book.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {book.status === 'available' ? 'Disponible' : 
                       book.status === 'borrowed' ? 'Emprunté' : 'Maintenance'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMembersReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-600 font-semibold">Total des membres</p>
          <p className="text-2xl font-bold text-blue-900">{members.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-green-600 font-semibold">Membres actifs</p>
          <p className="text-2xl font-bold text-green-900">
            {members.filter(m => m.status === 'active').length}
          </p>
        </div>
        <div className="bg-amber-50 p-6 rounded-lg">
          <p className="text-amber-600 font-semibold">Membres premium</p>
          <p className="text-2xl font-bold text-amber-900">
            {members.filter(m => m.membershipType === 'premium').length}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des membres</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emprunts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pénalités</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {member.firstName} {member.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{member.membershipType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.totalBorrows}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.penalties}€</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' :
                      member.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.status === 'active' ? 'Actif' : 
                       member.status === 'suspended' ? 'Suspendu' : 'Expiré'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBorrowsReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-600 font-semibold">Total des emprunts</p>
          <p className="text-2xl font-bold text-blue-900">{borrows.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-green-600 font-semibold">Emprunts actifs</p>
          <p className="text-2xl font-bold text-green-900">
            {borrows.filter(b => b.status === 'active').length}
          </p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="text-red-600 font-semibold">Emprunts en retard</p>
          <p className="text-2xl font-bold text-red-900">
            {borrows.filter(b => b.status === 'overdue').length}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historique des emprunts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date emprunt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date retour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pénalité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {borrows.map((borrow) => {
                const book = books.find(b => b.id === borrow.bookId);
                const member = members.find(m => m.id === borrow.memberId);
                return (
                  <tr key={borrow.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{book?.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {member?.firstName} {member?.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {borrow.borrowDate.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {borrow.returnDate ? borrow.returnDate.toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        borrow.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        borrow.status === 'returned' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {borrow.status === 'active' ? 'Actif' : 
                         borrow.status === 'returned' ? 'Retourné' : 'En retard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{borrow.penalty}€</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReport = () => {
    switch (selectedReport) {
      case 'overview': return renderOverviewReport();
      case 'books': return renderBooksReport();
      case 'members': return renderMembersReport();
      case 'borrows': return renderBorrowsReport();
      default: return renderOverviewReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports et statistiques</h1>
          <p className="text-gray-600">Analysez les données de votre bibliothèque</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4" />
          <span>Exporter PDF</span>
        </button>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-4 overflow-x-auto">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedReport === type.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderReport()}
      </div>
    </div>
  );
};

export default Reports;