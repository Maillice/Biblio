import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { Book, Member, BorrowRecord, Reservation, User, ActivityLog, Statistics } from '../types';

export const useSupabaseData = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert database row to Book type
  const convertToBook = (row: any): Book => ({
    id: row.id,
    title: row.title,
    author: row.author,
    isbn: row.isbn,
    category: row.category,
    language: row.language,
    level: row.level,
    publicationYear: row.publication_year || 0,
    pages: row.pages,
    publisher: row.publisher,
    status: row.status,
    totalCopies: row.total_copies,
    availableCopies: row.available_copies,
    location: row.location,
    description: row.description,
    coverImage: row.cover_image,
    addedDate: new Date(row.added_date),
    lastUpdated: new Date(row.last_updated)
  });

  // Convert database row to Member type
  const convertToMember = (row: any): Member => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    membershipType: row.membership_type,
    joinDate: new Date(row.join_date),
    expiryDate: new Date(row.expiry_date),
    status: row.status,
    totalBorrows: row.total_borrows,
    currentBorrows: row.current_borrows,
    penalties: row.penalties,
    qrCode: row.qr_code,
    profileImage: row.profile_image
  });

  // Convert database row to BorrowRecord type
  const convertToBorrowRecord = (row: any): BorrowRecord => ({
    id: row.id,
    bookId: row.book_id,
    memberId: row.member_id,
    borrowDate: new Date(row.borrow_date),
    dueDate: new Date(row.due_date),
    returnDate: row.return_date ? new Date(row.return_date) : undefined,
    status: row.status,
    renewalCount: row.renewal_count,
    penalty: row.penalty,
    notes: row.notes
  });

  // Convert database row to Reservation type
  const convertToReservation = (row: any): Reservation => ({
    id: row.id,
    bookId: row.book_id,
    memberId: row.member_id,
    reservationDate: new Date(row.reservation_date),
    status: row.status,
    notificationSent: row.notification_sent,
    priority: row.priority
  });

  // Convert database row to User type
  const convertToUser = (row: any): User => ({
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    firstName: row.first_name,
    lastName: row.last_name,
    lastLogin: row.last_login ? new Date(row.last_login) : new Date(),
    status: row.status,
    permissions: row.permissions || []
  });

  // Convert database row to ActivityLog type
  const convertToActivityLog = (row: any): ActivityLog => ({
    id: row.id,
    userId: row.user_id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    details: row.details,
    timestamp: new Date(row.timestamp)
  });

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch books
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .order('title');
      
      if (booksError) throw booksError;
      setBooks(booksData?.map(convertToBook) || []);

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('first_name');
      
      if (membersError) throw membersError;
      setMembers(membersData?.map(convertToMember) || []);

      // Fetch borrow records
      const { data: borrowsData, error: borrowsError } = await supabase
        .from('borrow_records')
        .select('*')
        .order('borrow_date', { ascending: false });
      
      if (borrowsError) throw borrowsError;
      setBorrows(borrowsData?.map(convertToBorrowRecord) || []);

      // Fetch reservations
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: false });
      
      if (reservationsError) throw reservationsError;
      setReservations(reservationsData?.map(convertToReservation) || []);

      // Fetch library users
      const { data: usersData, error: usersError } = await supabase
        .from('library_users')
        .select('*')
        .order('first_name');
      
      if (usersError) throw usersError;
      setUsers(usersData?.map(convertToUser) || []);

      // Fetch activity logs
      const { data: logsData, error: logsError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (logsError) throw logsError;
      setActivityLogs(logsData?.map(convertToActivityLog) || []);

    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching data:', err);
      
      // If it's a connection error, provide helpful guidance
      if (err.message?.includes('NetworkError') || err.message?.includes('fetch')) {
        setError('Impossible de se connecter à la base de données. Veuillez configurer Supabase en cliquant sur "Connect to Supabase" en haut à droite.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStatistics = (): Statistics => {
    const totalBooks = books.length;
    const totalMembers = members.length;
    const activeBorrows = borrows.filter(b => b.status === 'active').length;
    const overdueBooks = borrows.filter(b => b.status === 'overdue').length;
    const pendingReservations = reservations.filter(r => r.status === 'pending').length;
    const totalPenalties = borrows.reduce((sum, b) => sum + b.penalty, 0);
    
    const currentMonth = new Date().getMonth();
    const monthlyBorrows = borrows.filter(b => b.borrowDate.getMonth() === currentMonth).length;
    
    const bookBorrowCounts = books.map(book => ({
      ...book,
      borrowCount: borrows.filter(b => b.bookId === book.id).length
    }));
    const popularBooks = bookBorrowCounts
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 5);
    
    const activeMembers = members
      .filter(m => m.status === 'active')
      .sort((a, b) => b.totalBorrows - a.totalBorrows)
      .slice(0, 5);

    return {
      totalBooks,
      totalMembers,
      activeBorrows,
      overdueBooks,
      pendingReservations,
      totalPenalties,
      monthlyBorrows,
      popularBooks,
      activeMembers
    };
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchData();

    // Subscribe to changes
    const booksSubscription = supabase
      .channel('books_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, () => {
        fetchData();
      })
      .subscribe();

    const membersSubscription = supabase
      .channel('members_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        fetchData();
      })
      .subscribe();

    const borrowsSubscription = supabase
      .channel('borrows_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'borrow_records' }, () => {
        fetchData();
      })
      .subscribe();

    const reservationsSubscription = supabase
      .channel('reservations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        fetchData();
      })
      .subscribe();

    const activitySubscription = supabase
      .channel('activity_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      booksSubscription.unsubscribe();
      membersSubscription.unsubscribe();
      borrowsSubscription.unsubscribe();
      reservationsSubscription.unsubscribe();
      activitySubscription.unsubscribe();
    };
  }, []);

  return {
    books,
    members,
    borrows,
    reservations,
    users,
    activityLogs,
    statistics: calculateStatistics(),
    loading,
    error,
    refetch: fetchData
  };
};