import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { Book } from '../../types';

const BookList: React.FC = () => {
  const { books, deleteBook } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const categories = [...new Set(books.map(book => book.category))];
  const statuses = ['available', 'borrowed', 'reserved', 'maintenance'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = !filterCategory || book.category === filterCategory;
    const matchesStatus = !filterStatus || book.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'borrowed': return 'bg-blue-100 text-blue-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'borrowed': return 'Emprunté';
      case 'reserved': return 'Réservé';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const handleDeleteBook = (bookId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      deleteBook(bookId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des livres</h1>
          <p className="text-gray-600">Gérez votre collection de livres</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un livre</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur ou ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
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
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                  {getStatusText(book.status)}
                </span>
              </div>
              <div className="ml-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ISBN:</span>
                <span className="text-gray-900">{book.isbn}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Catégorie:</span>
                <span className="text-gray-900">{book.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Disponibles:</span>
                <span className="text-gray-900">{book.availableCopies}/{book.totalCopies}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Lieu:</span>
                <span className="text-gray-900">{book.location}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedBook(book);
                  setShowDetailsModal(true);
                }}
                className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
              >
                <Eye className="h-4 w-4" />
                <span>Voir</span>
              </button>
              <button
                onClick={() => {
                  setSelectedBook(book);
                  setShowAddModal(true);
                }}
                className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center justify-center space-x-1"
              >
                <Edit className="h-4 w-4" />
                <span>Modifier</span>
              </button>
              <button
                onClick={() => handleDeleteBook(book.id)}
                className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-100 transition-colors flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun livre trouvé</h3>
          <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ajouter le premier livre
          </button>
        </div>
      )}

      {/* Book Details Modal */}
      {showDetailsModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">{selectedBook.title}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Informations générales</h3>
                  <div className="space-y-2">
                    <div><span className="text-gray-500">Auteur:</span> {selectedBook.author}</div>
                    <div><span className="text-gray-500">ISBN:</span> {selectedBook.isbn}</div>
                    <div><span className="text-gray-500">Catégorie:</span> {selectedBook.category}</div>
                    <div><span className="text-gray-500">Langue:</span> {selectedBook.language}</div>
                    <div><span className="text-gray-500">Niveau:</span> {selectedBook.level}</div>
                    <div><span className="text-gray-500">Année:</span> {selectedBook.publicationYear}</div>
                    <div><span className="text-gray-500">Pages:</span> {selectedBook.pages}</div>
                    <div><span className="text-gray-500">Éditeur:</span> {selectedBook.publisher}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Disponibilité</h3>
                  <div className="space-y-2">
                    <div><span className="text-gray-500">Statut:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBook.status)}`}>
                        {getStatusText(selectedBook.status)}
                      </span>
                    </div>
                    <div><span className="text-gray-500">Exemplaires totaux:</span> {selectedBook.totalCopies}</div>
                    <div><span className="text-gray-500">Exemplaires disponibles:</span> {selectedBook.availableCopies}</div>
                    <div><span className="text-gray-500">Emplacement:</span> {selectedBook.location}</div>
                    <div><span className="text-gray-500">Ajouté le:</span> {selectedBook.addedDate.toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
              </div>
              
              {selectedBook.description && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700">{selectedBook.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;