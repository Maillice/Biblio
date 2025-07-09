import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, QrCode, Mail, Phone } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { Member } from '../../types';

const MemberList: React.FC = () => {
  const { members, deleteMember } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const membershipTypes = ['standard', 'premium', 'student'];
  const statuses = ['active', 'suspended', 'expired'];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || member.membershipType === filterType;
    const matchesStatus = !filterStatus || member.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getMembershipTypeColor = (type: string) => {
    switch (type) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipTypeText = (type: string) => {
    switch (type) {
      case 'premium': return 'Premium';
      case 'standard': return 'Standard';
      case 'student': return 'Étudiant';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'suspended': return 'Suspendu';
      case 'expired': return 'Expiré';
      default: return status;
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      deleteMember(memberId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des membres</h1>
          <p className="text-gray-600">Gérez les membres de votre bibliothèque</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un membre</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            {membershipTypes.map(type => (
              <option key={type} value={type}>{getMembershipTypeText(type)}</option>
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
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.firstName} {member.lastName}</h3>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMembershipTypeColor(member.membershipType)}`}>
                  {getMembershipTypeText(member.membershipType)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                  {getStatusText(member.status)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{member.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Emprunts totaux:</span>
                <span className="text-gray-900 font-medium">{member.totalBorrows}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Emprunts actuels:</span>
                <span className="text-gray-900 font-medium">{member.currentBorrows}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pénalités:</span>
                <span className={`font-medium ${member.penalties > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {member.penalties > 0 ? `${member.penalties}€` : 'Aucune'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Membre depuis:</span>
                <span className="text-gray-900">{member.joinDate.toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedMember(member);
                  setShowDetailsModal(true);
                }}
                className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
              >
                <Eye className="h-4 w-4" />
                <span>Voir</span>
              </button>
              <button
                onClick={() => {
                  setSelectedMember(member);
                  setShowAddModal(true);
                }}
                className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center justify-center space-x-1"
              >
                <Edit className="h-4 w-4" />
                <span>Modifier</span>
              </button>
              <button
                onClick={() => handleDeleteMember(member.id)}
                className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-100 transition-colors flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-lg">👤</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre trouvé</h3>
          <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ajouter le premier membre
          </button>
        </div>
      )}

      {/* Member Details Modal */}
      {showDetailsModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xl">
                      {selectedMember.firstName.charAt(0)}{selectedMember.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </h2>
                    <p className="text-gray-600">{selectedMember.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Informations personnelles</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedMember.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedMember.phone}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Adresse:</span><br />
                      <span>{selectedMember.address}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Statut du membre</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMembershipTypeColor(selectedMember.membershipType)}`}>
                        {getMembershipTypeText(selectedMember.membershipType)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Statut:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMember.status)}`}>
                        {getStatusText(selectedMember.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Membre depuis:</span>
                      <span>{selectedMember.joinDate.toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expire le:</span>
                      <span>{selectedMember.expiryDate.toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedMember.totalBorrows}</div>
                  <div className="text-sm text-blue-600">Emprunts totaux</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedMember.currentBorrows}</div>
                  <div className="text-sm text-green-600">Emprunts actuels</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{selectedMember.penalties}€</div>
                  <div className="text-sm text-red-600">Pénalités</div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center space-x-4">
                <QrCode className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Code QR</p>
                  <p className="text-sm text-gray-600">{selectedMember.qrCode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;