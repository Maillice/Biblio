import React from 'react';
import { BookOpen, Users, ArrowRightLeft, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import StatCard from './StatCard';
import { useLibrary } from '../../contexts/LibraryContext';

const Dashboard: React.FC = () => {
  const { statistics, books, members, activityLogs } = useLibrary();
  
  const recentActivity = activityLogs.slice(0, 5);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre bibliothèque</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total des livres"
          value={statistics.totalBooks}
          icon={BookOpen}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Membres actifs"
          value={statistics.totalMembers}
          icon={Users}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Emprunts actifs"
          value={statistics.activeBorrows}
          icon={ArrowRightLeft}
          color="indigo"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Réservations"
          value={statistics.pendingReservations}
          icon={Calendar}
          color="purple"
          trend={{ value: 5, isPositive: false }}
        />
      </div>
      
      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Livres en retard"
          value={statistics.overdueBooks}
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Emprunts ce mois"
          value={statistics.monthlyBorrows}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Pénalités totales"
          value={`${statistics.totalPenalties.toFixed(2)}€`}
          icon={AlertTriangle}
          color="red"
        />
      </div>
      
      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Books */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Livres populaires</h3>
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
                  <p className="text-xs text-gray-500">{book.availableCopies} disponibles</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.details}</p>
                  <p className="text-xs text-gray-500">
                    {activity.timestamp.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Active Members */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Membres les plus actifs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statistics.activeMembers.map((member) => (
            <div key={member.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                  <p className="text-sm text-gray-500">{member.totalBorrows} emprunts</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <span className={`inline-block px-2 py-1 rounded ${
                  member.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;