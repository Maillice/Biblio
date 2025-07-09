import { Book, Member, BorrowRecord, Reservation, User, ActivityLog } from '../types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    isbn: '978-2-07-040834-2',
    category: 'Fiction',
    language: 'Français',
    level: 'Intermédiaire',
    publicationYear: 1943,
    pages: 96,
    publisher: 'Gallimard',
    status: 'available',
    totalCopies: 3,
    availableCopies: 2,
    location: 'A-01-001',
    description: 'Un conte philosophique et poétique sous l\'apparence d\'un conte pour enfants.',
    addedDate: new Date('2024-01-15'),
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Les Misérables',
    author: 'Victor Hugo',
    isbn: '978-2-253-01125-1',
    category: 'Littérature classique',
    language: 'Français',
    level: 'Avancé',
    publicationYear: 1862,
    pages: 1664,
    publisher: 'Le Livre de Poche',
    status: 'borrowed',
    totalCopies: 2,
    availableCopies: 0,
    location: 'A-02-015',
    description: 'Un roman historique français qui décrit la vie de misérables dans Paris.',
    addedDate: new Date('2024-01-10'),
    lastUpdated: new Date('2024-01-20')
  },
  {
    id: '3',
    title: 'L\'Étranger',
    author: 'Albert Camus',
    isbn: '978-2-07-036002-1',
    category: 'Philosophie',
    language: 'Français',
    level: 'Avancé',
    publicationYear: 1942,
    pages: 144,
    publisher: 'Gallimard',
    status: 'available',
    totalCopies: 4,
    availableCopies: 3,
    location: 'B-01-008',
    description: 'Roman emblématique de la littérature française du XXe siècle.',
    addedDate: new Date('2024-01-12'),
    lastUpdated: new Date('2024-01-12')
  },
  {
    id: '4',
    title: 'Le Comte de Monte-Cristo',
    author: 'Alexandre Dumas',
    isbn: '978-2-253-00611-0',
    category: 'Aventure',
    language: 'Français',
    level: 'Intermédiaire',
    publicationYear: 1844,
    pages: 1248,
    publisher: 'Le Livre de Poche',
    status: 'reserved',
    totalCopies: 2,
    availableCopies: 1,
    location: 'A-03-022',
    description: 'Roman d\'aventure qui raconte l\'histoire d\'Edmond Dantès.',
    addedDate: new Date('2024-01-08'),
    lastUpdated: new Date('2024-01-25')
  },
  {
    id: '5',
    title: 'Madame Bovary',
    author: 'Gustave Flaubert',
    isbn: '978-2-07-041216-5',
    category: 'Littérature classique',
    language: 'Français',
    level: 'Avancé',
    publicationYear: 1857,
    pages: 464,
    publisher: 'Gallimard',
    status: 'available',
    totalCopies: 3,
    availableCopies: 3,
    location: 'A-02-018',
    description: 'Chef-d\'œuvre du réalisme français.',
    addedDate: new Date('2024-01-05'),
    lastUpdated: new Date('2024-01-05')
  }
];

export const mockMembers: Member[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@email.com',
    phone: '01 23 45 67 89',
    address: '123 Rue de la Paix, 75001 Paris',
    membershipType: 'premium',
    joinDate: new Date('2023-09-15'),
    expiryDate: new Date('2024-09-15'),
    status: 'active',
    totalBorrows: 24,
    currentBorrows: 2,
    penalties: 0,
    qrCode: 'QR_001_MARIE_DUBOIS'
  },
  {
    id: '2',
    firstName: 'Pierre',
    lastName: 'Martin',
    email: 'pierre.martin@email.com',
    phone: '01 23 45 67 90',
    address: '456 Avenue des Champs, 75008 Paris',
    membershipType: 'standard',
    joinDate: new Date('2023-11-20'),
    expiryDate: new Date('2024-11-20'),
    status: 'active',
    totalBorrows: 18,
    currentBorrows: 1,
    penalties: 2.5,
    qrCode: 'QR_002_PIERRE_MARTIN'
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Leroy',
    email: 'sophie.leroy@email.com',
    phone: '01 23 45 67 91',
    address: '789 Boulevard Saint-Germain, 75006 Paris',
    membershipType: 'student',
    joinDate: new Date('2023-10-10'),
    expiryDate: new Date('2024-10-10'),
    status: 'active',
    totalBorrows: 35,
    currentBorrows: 3,
    penalties: 0,
    qrCode: 'QR_003_SOPHIE_LEROY'
  },
  {
    id: '4',
    firstName: 'Antoine',
    lastName: 'Moreau',
    email: 'antoine.moreau@email.com',
    phone: '01 23 45 67 92',
    address: '321 Rue de Rivoli, 75001 Paris',
    membershipType: 'standard',
    joinDate: new Date('2023-08-05'),
    expiryDate: new Date('2024-08-05'),
    status: 'suspended',
    totalBorrows: 12,
    currentBorrows: 0,
    penalties: 15.5,
    qrCode: 'QR_004_ANTOINE_MOREAU'
  }
];

export const mockBorrows: BorrowRecord[] = [
  {
    id: '1',
    bookId: '2',
    memberId: '1',
    borrowDate: new Date('2024-01-20'),
    dueDate: new Date('2024-02-03'),
    status: 'active',
    renewalCount: 0,
    penalty: 0
  },
  {
    id: '2',
    bookId: '1',
    memberId: '2',
    borrowDate: new Date('2024-01-18'),
    dueDate: new Date('2024-02-01'),
    status: 'active',
    renewalCount: 1,
    penalty: 0
  },
  {
    id: '3',
    bookId: '3',
    memberId: '3',
    borrowDate: new Date('2024-01-15'),
    dueDate: new Date('2024-01-29'),
    returnDate: new Date('2024-01-28'),
    status: 'returned',
    renewalCount: 0,
    penalty: 0
  },
  {
    id: '4',
    bookId: '4',
    memberId: '3',
    borrowDate: new Date('2024-01-10'),
    dueDate: new Date('2024-01-24'),
    status: 'overdue',
    renewalCount: 0,
    penalty: 5.5
  }
];

export const mockReservations: Reservation[] = [
  {
    id: '1',
    bookId: '2',
    memberId: '3',
    reservationDate: new Date('2024-01-22'),
    status: 'pending',
    notificationSent: false,
    priority: 1
  },
  {
    id: '2',
    bookId: '4',
    memberId: '2',
    reservationDate: new Date('2024-01-25'),
    status: 'pending',
    notificationSent: false,
    priority: 1
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@bibliotheque.com',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'Système',
    lastLogin: new Date('2024-01-28'),
    status: 'active',
    permissions: ['all']
  },
  {
    id: '2',
    username: 'biblio1',
    email: 'bibliothecaire1@bibliotheque.com',
    role: 'librarian',
    firstName: 'Julie',
    lastName: 'Bernard',
    lastLogin: new Date('2024-01-28'),
    status: 'active',
    permissions: ['books', 'members', 'borrows', 'reservations']
  },
  {
    id: '3',
    username: 'biblio2',
    email: 'bibliothecaire2@bibliotheque.com',
    role: 'librarian',
    firstName: 'Thomas',
    lastName: 'Durand',
    lastLogin: new Date('2024-01-27'),
    status: 'active',
    permissions: ['books', 'members', 'borrows']
  }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    action: 'CREATE',
    entityType: 'book',
    entityId: '1',
    details: 'Livre ajouté: Le Petit Prince',
    timestamp: new Date('2024-01-28T10:30:00')
  },
  {
    id: '2',
    userId: '2',
    action: 'BORROW',
    entityType: 'borrow',
    entityId: '1',
    details: 'Emprunt: Les Misérables par Marie Dubois',
    timestamp: new Date('2024-01-28T11:15:00')
  },
  {
    id: '3',
    userId: '2',
    action: 'RETURN',
    entityType: 'borrow',
    entityId: '3',
    details: 'Retour: L\'Étranger par Sophie Leroy',
    timestamp: new Date('2024-01-28T14:20:00')
  },
  {
    id: '4',
    userId: '1',
    action: 'UPDATE',
    entityType: 'member',
    entityId: '4',
    details: 'Membre modifié: Antoine Moreau suspendu',
    timestamp: new Date('2024-01-28T16:45:00')
  }
];