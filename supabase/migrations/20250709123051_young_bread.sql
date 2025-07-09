/*
  # Données initiales pour le système de bibliothèque

  1. Données de test
    - Livres d'exemple avec informations complètes
    - Membres de test avec différents profils
    - Utilisateurs système (admin, bibliothécaires)
    - Quelques emprunts et réservations d'exemple

  2. Configuration
    - Utilisateur admin par défaut
    - Données réalistes pour démonstration
*/

-- Insert sample books
INSERT INTO books (title, author, isbn, category, language, level, publication_year, pages, publisher, status, total_copies, available_copies, location, description) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2-07-040834-2', 'Fiction', 'Français', 'Intermédiaire', 1943, 96, 'Gallimard', 'available', 3, 2, 'A-01-001', 'Un conte philosophique et poétique sous l''apparence d''un conte pour enfants.'),
('Les Misérables', 'Victor Hugo', '978-2-253-01125-1', 'Littérature classique', 'Français', 'Avancé', 1862, 1664, 'Le Livre de Poche', 'borrowed', 2, 0, 'A-02-015', 'Un roman historique français qui décrit la vie de misérables dans Paris.'),
('L''Étranger', 'Albert Camus', '978-2-07-036002-1', 'Philosophie', 'Français', 'Avancé', 1942, 144, 'Gallimard', 'available', 4, 3, 'B-01-008', 'Roman emblématique de la littérature française du XXe siècle.'),
('Le Comte de Monte-Cristo', 'Alexandre Dumas', '978-2-253-00611-0', 'Aventure', 'Français', 'Intermédiaire', 1844, 1248, 'Le Livre de Poche', 'reserved', 2, 1, 'A-03-022', 'Roman d''aventure qui raconte l''histoire d''Edmond Dantès.'),
('Madame Bovary', 'Gustave Flaubert', '978-2-07-041216-5', 'Littérature classique', 'Français', 'Avancé', 1857, 464, 'Gallimard', 'available', 3, 3, 'A-02-018', 'Chef-d''œuvre du réalisme français.'),
('1984', 'George Orwell', '978-0-452-28423-4', 'Science-fiction', 'Anglais', 'Avancé', 1949, 328, 'Penguin Books', 'available', 2, 2, 'B-02-012', 'Dystopie totalitaire devenue un classique de la littérature.'),
('Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8', 'Romance', 'Anglais', 'Intermédiaire', 1813, 432, 'Penguin Classics', 'available', 2, 1, 'B-03-005', 'Roman romantique anglais du XIXe siècle.'),
('Don Quichotte', 'Miguel de Cervantes', '978-2-07-040442-9', 'Littérature classique', 'Espagnol', 'Avancé', 1605, 1056, 'Gallimard', 'available', 1, 1, 'C-01-003', 'Chef-d''œuvre de la littérature espagnole.'),
('Le Seigneur des Anneaux', 'J.R.R. Tolkien', '978-2-267-01917-0', 'Fantasy', 'Français', 'Intermédiaire', 1954, 1216, 'Christian Bourgois', 'borrowed', 3, 1, 'D-01-001', 'Épopée fantasy incontournable.'),
('Harry Potter à l''école des sorciers', 'J.K. Rowling', '978-2-07-054120-1', 'Fantasy jeunesse', 'Français', 'Débutant', 1997, 320, 'Gallimard Jeunesse', 'available', 5, 4, 'D-02-008', 'Premier tome de la saga Harry Potter.');

-- Insert sample members
INSERT INTO members (first_name, last_name, email, phone, address, membership_type, status, total_borrows, current_borrows, penalties, qr_code) VALUES
('Marie', 'Dubois', 'marie.dubois@email.com', '01 23 45 67 89', '123 Rue de la Paix, 75001 Paris', 'premium', 'active', 24, 2, 0, 'QR_001_MARIE_DUBOIS'),
('Pierre', 'Martin', 'pierre.martin@email.com', '01 23 45 67 90', '456 Avenue des Champs, 75008 Paris', 'standard', 'active', 18, 1, 2.5, 'QR_002_PIERRE_MARTIN'),
('Sophie', 'Leroy', 'sophie.leroy@email.com', '01 23 45 67 91', '789 Boulevard Saint-Germain, 75006 Paris', 'student', 'active', 35, 3, 0, 'QR_003_SOPHIE_LEROY'),
('Antoine', 'Moreau', 'antoine.moreau@email.com', '01 23 45 67 92', '321 Rue de Rivoli, 75001 Paris', 'standard', 'suspended', 12, 0, 15.5, 'QR_004_ANTOINE_MOREAU'),
('Camille', 'Bernard', 'camille.bernard@email.com', '01 23 45 67 93', '654 Avenue Montaigne, 75008 Paris', 'premium', 'active', 28, 1, 0, 'QR_005_CAMILLE_BERNARD'),
('Lucas', 'Petit', 'lucas.petit@email.com', '01 23 45 67 94', '987 Rue du Faubourg, 75011 Paris', 'student', 'active', 15, 2, 1.0, 'QR_006_LUCAS_PETIT');

-- Insert sample library users (will be linked to auth.users after authentication setup)
INSERT INTO library_users (username, email, role, first_name, last_name, status, permissions) VALUES
('admin', 'admin@bibliotheque.com', 'admin', 'Admin', 'Système', 'active', '["all"]'::jsonb),
('biblio1', 'bibliothecaire1@bibliotheque.com', 'librarian', 'Julie', 'Bernard', 'active', '["books", "members", "borrows", "reservations"]'::jsonb),
('biblio2', 'bibliothecaire2@bibliotheque.com', 'librarian', 'Thomas', 'Durand', 'active', '["books", "members", "borrows"]'::jsonb);

-- Insert sample borrow records
INSERT INTO borrow_records (book_id, member_id, borrow_date, due_date, status, renewal_count, penalty) VALUES
(
  (SELECT id FROM books WHERE isbn = '978-2-253-01125-1'),
  (SELECT id FROM members WHERE email = 'marie.dubois@email.com'),
  now() - interval '8 days',
  now() + interval '6 days',
  'active',
  0,
  0
),
(
  (SELECT id FROM books WHERE isbn = '978-2-07-040834-2'),
  (SELECT id FROM members WHERE email = 'pierre.martin@email.com'),
  now() - interval '10 days',
  now() + interval '4 days',
  'active',
  1,
  0
),
(
  (SELECT id FROM books WHERE isbn = '978-2-267-01917-0'),
  (SELECT id FROM members WHERE email = 'sophie.leroy@email.com'),
  now() - interval '5 days',
  now() + interval '9 days',
  'active',
  0,
  0
),
(
  (SELECT id FROM books WHERE isbn = '978-2-07-036002-1'),
  (SELECT id FROM members WHERE email = 'sophie.leroy@email.com'),
  now() - interval '20 days',
  now() - interval '6 days',
  'returned',
  0,
  0
),
(
  (SELECT id FROM books WHERE isbn = '978-2-253-00611-0'),
  (SELECT id FROM members WHERE email = 'lucas.petit@email.com'),
  now() - interval '18 days',
  now() - interval '4 days',
  'overdue',
  0,
  5.5
);

-- Insert sample reservations
INSERT INTO reservations (book_id, member_id, reservation_date, status, notification_sent, priority) VALUES
(
  (SELECT id FROM books WHERE isbn = '978-2-253-01125-1'),
  (SELECT id FROM members WHERE email = 'sophie.leroy@email.com'),
  now() - interval '2 days',
  'pending',
  false,
  1
),
(
  (SELECT id FROM books WHERE isbn = '978-2-253-00611-0'),
  (SELECT id FROM members WHERE email = 'pierre.martin@email.com'),
  now() - interval '1 day',
  'pending',
  false,
  1
),
(
  (SELECT id FROM books WHERE isbn = '978-0-14-143951-8'),
  (SELECT id FROM members WHERE email = 'camille.bernard@email.com'),
  now() - interval '3 days',
  'pending',
  true,
  1
);

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES
(
  (SELECT id FROM library_users WHERE username = 'admin'),
  'CREATE',
  'book',
  (SELECT id FROM books WHERE isbn = '978-2-07-040834-2'),
  'Livre ajouté: Le Petit Prince'
),
(
  (SELECT id FROM library_users WHERE username = 'biblio1'),
  'BORROW',
  'borrow',
  (SELECT id FROM borrow_records WHERE book_id = (SELECT id FROM books WHERE isbn = '978-2-253-01125-1') LIMIT 1),
  'Emprunt: Les Misérables par Marie Dubois'
),
(
  (SELECT id FROM library_users WHERE username = 'biblio1'),
  'RETURN',
  'borrow',
  (SELECT id FROM borrow_records WHERE status = 'returned' LIMIT 1),
  'Retour: L''Étranger par Sophie Leroy'
),
(
  (SELECT id FROM library_users WHERE username = 'admin'),
  'UPDATE',
  'member',
  (SELECT id FROM members WHERE email = 'antoine.moreau@email.com'),
  'Membre modifié: Antoine Moreau suspendu'
),
(
  (SELECT id FROM library_users WHERE username = 'biblio2'),
  'RESERVE',
  'reservation',
  (SELECT id FROM reservations LIMIT 1),
  'Réservation: Les Misérables par Sophie Leroy'
);