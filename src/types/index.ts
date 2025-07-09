export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  language: string;
  level: string;
  publicationYear: number;
  pages: number;
  publisher: string;
  status: 'available' | 'borrowed' | 'reserved' | 'maintenance';
  totalCopies: number;
  availableCopies: number;
  location: string;
  description: string;
  coverImage?: string;
  addedDate: Date;
  lastUpdated: Date;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipType: 'standard' | 'premium' | 'student';
  joinDate: Date;
  expiryDate: Date;
  status: 'active' | 'suspended' | 'expired';
  totalBorrows: number;
  currentBorrows: number;
  penalties: number;
  qrCode: string;
  profileImage?: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  memberId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'returned' | 'overdue';
  renewalCount: number;
  penalty: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  bookId: string;
  memberId: string;
  reservationDate: Date;
  status: 'pending' | 'fulfilled' | 'cancelled' | 'expired';
  notificationSent: boolean;
  priority: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'librarian' | 'reader';
  firstName: string;
  lastName: string;
  lastLogin: Date;
  status: 'active' | 'inactive';
  permissions: string[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'book' | 'member' | 'borrow' | 'reservation';
  entityId: string;
  details: string;
  timestamp: Date;
}

export interface Statistics {
  totalBooks: number;
  totalMembers: number;
  activeBorrows: number;
  overdueBooks: number;
  pendingReservations: number;
  totalPenalties: number;
  monthlyBorrows: number;
  popularBooks: Book[];
  activeMembers: Member[];
}