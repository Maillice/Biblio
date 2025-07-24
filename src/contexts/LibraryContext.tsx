import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Member, BorrowRecord, Reservation, User, ActivityLog, Statistics } from '../types';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { bookService, memberService, borrowService, reservationService, activityService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

interface LibraryContextType {
  books: Book[];
  members: Member[];
  borrows: BorrowRecord[];
  reservations: Reservation[];
  users: User[];
  activityLogs: ActivityLog[];
  statistics: Statistics;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  
  // Book operations
  addBook: (book: Omit<Book, 'id' | 'addedDate' | 'lastUpdated'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  
  // Member operations
  addMember: (member: Omit<Member, 'id' | 'joinDate' | 'qrCode'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  // Borrow operations
  borrowBook: (bookId: string, memberId: string) => void;
  returnBook: (borrowId: string) => void;
  renewBook: (borrowId: string) => void;
  
  // Reservation operations
  reserveBook: (bookId: string, memberId: string) => void;
  cancelReservation: (reservationId: string) => void;
  
  // Authentication
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Activity logging
  logActivity: (action: string, entityType: 'book' | 'member' | 'borrow' | 'reservation', entityId: string, details: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    books, 
    members, 
    borrows, 
    reservations, 
    users, 
    activityLogs, 
    statistics, 
    loading, 
    error, 
    refetch 
  } = useSupabaseData();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize current user
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: libraryUser } = await supabase
            .from('library_users')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (libraryUser) {
            setCurrentUser({
              id: libraryUser.id,
              username: libraryUser.username,
              email: libraryUser.email,
              role: libraryUser.role,
              firstName: libraryUser.first_name,
              lastName: libraryUser.last_name,
              lastLogin: libraryUser.last_login ? new Date(libraryUser.last_login) : new Date(),
              status: libraryUser.status,
              permissions: libraryUser.permissions || []
            });
          }
        } else {
          // Set a default demo user when not authenticated
          setCurrentUser({
            id: 'demo-user',
            username: 'demo',
            email: 'demo@bibliotheque.com',
            role: 'admin',
            firstName: 'Utilisateur',
            lastName: 'Démo',
            lastLogin: new Date(),
            status: 'active',
            permissions: ['all']
          });
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        // Set a default demo user on error
        setCurrentUser({
          id: 'demo-user',
          username: 'demo',
          email: 'demo@bibliotheque.com',
          role: 'admin',
          firstName: 'Utilisateur',
          lastName: 'Démo',
          lastLogin: new Date(),
          status: 'active',
          permissions: ['all']
        });
      }
    };
    
    initializeUser();
  }, []);

  const logActivity = async (action: string, entityType: 'book' | 'member' | 'borrow' | 'reservation', entityId: string, details: string) => {
    try {
      await activityService.log(action, entityType, entityId, details);
      refetch(); // Refresh data to show new activity
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const addBook = async (bookData: Omit<Book, 'id' | 'addedDate' | 'lastUpdated'>) => {
    try {
      const newBook = await bookService.create(bookData);
      await logActivity('CREATE', 'book', newBook.id, `Livre ajouté: ${bookData.title}`);
      refetch();
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      await bookService.update(id, updates);
      await logActivity('UPDATE', 'book', id, `Livre modifié`);
      refetch();
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const book = books.find(b => b.id === id);
      await bookService.delete(id);
      await logActivity('DELETE', 'book', id, `Livre supprimé: ${book?.title}`);
      refetch();
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  };

  const addMember = async (memberData: Omit<Member, 'id' | 'joinDate' | 'qrCode'>) => {
    try {
      const newMember = await memberService.create(memberData);
      await logActivity('CREATE', 'member', newMember.id, `Membre ajouté: ${memberData.firstName} ${memberData.lastName}`);
      refetch();
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      await memberService.update(id, updates);
      await logActivity('UPDATE', 'member', id, `Membre modifié`);
      refetch();
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const member = members.find(m => m.id === id);
      await memberService.delete(id);
      await logActivity('DELETE', 'member', id, `Membre supprimé: ${member?.firstName} ${member?.lastName}`);
      refetch();
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  };

  const borrowBook = async (bookId: string, memberId: string) => {
    try {
      const book = books.find(b => b.id === bookId);
      const member = members.find(m => m.id === memberId);
      
      if (!book || !member || book.availableCopies <= 0) {
        throw new Error('Livre non disponible ou membre introuvable');
      }

      const newBorrow = await borrowService.create(bookId, memberId);
      await logActivity('BORROW', 'borrow', newBorrow.id, `Emprunt: ${book.title} par ${member.firstName} ${member.lastName}`);
      refetch();
    } catch (error) {
      console.error('Error borrowing book:', error);
      throw error;
    }
  };

  const returnBook = async (borrowId: string) => {
    try {
      const borrow = borrows.find(b => b.id === borrowId);
      if (!borrow) throw new Error('Emprunt introuvable');

      const book = books.find(b => b.id === borrow.bookId);
      const member = members.find(m => m.id === borrow.memberId);

      await borrowService.return(borrowId);
      await logActivity('RETURN', 'borrow', borrowId, `Retour: ${book?.title} par ${member?.firstName} ${member?.lastName}`);
      refetch();
    } catch (error) {
      console.error('Error returning book:', error);
      throw error;
    }
  };

  const renewBook = async (borrowId: string) => {
    try {
      await borrowService.renew(borrowId);
      await logActivity('RENEW', 'borrow', borrowId, `Renouvellement d'emprunt`);
      refetch();
    } catch (error) {
      console.error('Error renewing book:', error);
      throw error;
    }
  };

  const reserveBook = async (bookId: string, memberId: string) => {
    try {
      const book = books.find(b => b.id === bookId);
      const member = members.find(m => m.id === memberId);
      
      if (!book || !member) {
        throw new Error('Livre ou membre introuvable');
      }

      const newReservation = await reservationService.create(bookId, memberId);
      await logActivity('RESERVE', 'reservation', newReservation.id, `Réservation: ${book.title} par ${member.firstName} ${member.lastName}`);
      refetch();
    } catch (error) {
      console.error('Error reserving book:', error);
      throw error;
    }
  };

  const cancelReservation = async (reservationId: string) => {
    try {
      await reservationService.cancel(reservationId);
      await logActivity('CANCEL', 'reservation', reservationId, `Réservation annulée`);
      refetch();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  };

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, lastLogin: new Date() } : u
      ));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value: LibraryContextType = {
    books,
    members,
    borrows,
    reservations,
    users,
    activityLogs,
    statistics,
    currentUser,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    addMember,
    updateMember,
    deleteMember,
    borrowBook,
    returnBook,
    renewBook,
    reserveBook,
    cancelReservation,
    login,
    logout,
    logActivity
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};