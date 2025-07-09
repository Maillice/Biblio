import React, { useState } from 'react';
import { Search, Filter, Activity, BookOpen, Users, ArrowRightLeft, Calendar } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

const ActivityLog: React.FC = () => {
  const { activityLogs, users } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterEntityType, setFilterEntityType] = useState('');

  const actions = ['CREATE', 'UPDATE', 'DELETE', 'BORROW', 'RETURN', 'RENEW', 'RESERVE', 'CANCEL'];
  const entityTypes = ['book', 'member', 'borrow', 'reservation'];

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !filterAction || log.action === filterAction;
    const matchesEntityType = !filterEntityType || log.entityType === filterEntityType;
    
    return matchesSearch && matchesAction && matchesEntityType;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'BORROW': return 'bg-purple-100 text-purple-800';
      case 'RETURN': return 'bg-cyan-100 text-cyan-800';
      case 'RENEW': return 'bg-yellow-100 text-yellow-800';
      case 'RESERVE': return 'bg-orange-100 text-orange-800';
      case 'CANCEL': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'CREATE': return 'Création';
      case 'UPDATE': return 'Modification';
      case 'DELETE': return 'Suppression';
      case 'BORROW': return 'Emprunt';
      case 'RETURN': return 'Retour';
      case 'RENEW': return 'Renouvellement';
      case 'RESERVE': return 'Réservation';
      case 'CANCEL': return 'Annulation';
      default: return action;
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'book': return <BookOpen className="h-4 w-4" />;
      case 'member': return <Users className="h-4 w-4" />;
      case 'borrow': return <ArrowRightLeft className="h-4 w-4" />;
      case 'reservation': return <Calendar className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getEntityTypeText = (entityType: string) => {
    switch (entityType) {
      case 'book': return 'Livre';
      case 'member': return 'Membre';
      case 'borrow': return 'Emprunt';
      case 'reservation': return 'Réservation';
      default: return entityType;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Journal d'activité</h1>
        <p className="text-gray-600">Suivez toutes les actions effectuées dans le système</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher dans l'activité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les actions</option>
            {actions.map(action => (
              <option key={action} value={action}>{getActionText(action)}</option>
            ))}
          </select>
          
          <select
            value={filterEntityType}
            onChange={(e) => setFilterEntityType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            {entityTypes.map(type => (
              <option key={type} value={type}>{getEntityTypeText(type)}</option>
            ))}
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const user = users.find(u => u.id === log.userId);
              return (
                <div key={log.id} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {getEntityIcon(log.entityType)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {getActionText(log.action)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {getEntityTypeText(log.entityType)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-900 mb-1">{log.details}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        Par {user?.firstName} {user?.lastName}
                      </span>
                      <span>•</span>
                      <span>
                        {log.timestamp.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune activité trouvée</h3>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;