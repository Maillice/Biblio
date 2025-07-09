/*
  # Schéma complet pour le système de gestion de bibliothèque

  1. Nouvelles Tables
    - `books` - Catalogue des livres avec toutes les informations
    - `members` - Membres de la bibliothèque avec profils complets
    - `borrow_records` - Historique des emprunts et retours
    - `reservations` - Système de réservation de livres
    - `activity_logs` - Journal d'activité du système
    - `library_users` - Utilisateurs du système (admin, bibliothécaires)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques d'accès basées sur les rôles
    - Authentification requise pour toutes les opérations

  3. Fonctionnalités
    - Contraintes d'intégrité référentielle
    - Index pour les performances
    - Triggers pour les mises à jour automatiques
    - Valeurs par défaut appropriées
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  author text NOT NULL,
  isbn text UNIQUE NOT NULL,
  category text NOT NULL,
  language text DEFAULT 'Français',
  level text DEFAULT 'Débutant',
  publication_year integer,
  pages integer DEFAULT 0,
  publisher text DEFAULT '',
  status text DEFAULT 'available' CHECK (status IN ('available', 'borrowed', 'reserved', 'maintenance')),
  total_copies integer DEFAULT 1 CHECK (total_copies > 0),
  available_copies integer DEFAULT 1 CHECK (available_copies >= 0),
  location text DEFAULT '',
  description text DEFAULT '',
  cover_image text,
  added_date timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now()
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  membership_type text DEFAULT 'standard' CHECK (membership_type IN ('standard', 'premium', 'student')),
  join_date timestamptz DEFAULT now(),
  expiry_date timestamptz DEFAULT (now() + interval '1 year'),
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired')),
  total_borrows integer DEFAULT 0,
  current_borrows integer DEFAULT 0,
  penalties numeric(10,2) DEFAULT 0,
  qr_code text UNIQUE NOT NULL,
  profile_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Borrow records table
CREATE TABLE IF NOT EXISTS borrow_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  borrow_date timestamptz DEFAULT now(),
  due_date timestamptz NOT NULL,
  return_date timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
  renewal_count integer DEFAULT 0 CHECK (renewal_count >= 0),
  penalty numeric(10,2) DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  reservation_date timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled', 'expired')),
  notification_sent boolean DEFAULT false,
  priority integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Library users table (for system users)
CREATE TABLE IF NOT EXISTS library_users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'librarian' CHECK (role IN ('admin', 'librarian', 'reader')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  last_login timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  permissions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES library_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('book', 'member', 'borrow', 'reservation')),
  entity_id uuid NOT NULL,
  details text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);

CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_qr_code ON members(qr_code);

CREATE INDEX IF NOT EXISTS idx_borrow_records_book_id ON borrow_records(book_id);
CREATE INDEX IF NOT EXISTS idx_borrow_records_member_id ON borrow_records(member_id);
CREATE INDEX IF NOT EXISTS idx_borrow_records_status ON borrow_records(status);
CREATE INDEX IF NOT EXISTS idx_borrow_records_due_date ON borrow_records(due_date);

CREATE INDEX IF NOT EXISTS idx_reservations_book_id ON reservations(book_id);
CREATE INDEX IF NOT EXISTS idx_reservations_member_id ON reservations(member_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON activity_logs(entity_type);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrow_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for books
CREATE POLICY "Books are viewable by authenticated users"
  ON books
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Books can be managed by librarians and admins"
  ON books
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM library_users 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'librarian')
      AND status = 'active'
    )
  );

-- RLS Policies for members
CREATE POLICY "Members are viewable by authenticated users"
  ON members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Members can be managed by librarians and admins"
  ON members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM library_users 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'librarian')
      AND status = 'active'
    )
  );

-- RLS Policies for borrow_records
CREATE POLICY "Borrow records are viewable by authenticated users"
  ON borrow_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Borrow records can be managed by librarians and admins"
  ON borrow_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM library_users 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'librarian')
      AND status = 'active'
    )
  );

-- RLS Policies for reservations
CREATE POLICY "Reservations are viewable by authenticated users"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Reservations can be managed by librarians and admins"
  ON reservations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM library_users 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'librarian')
      AND status = 'active'
    )
  );

-- RLS Policies for library_users
CREATE POLICY "Users can view their own profile"
  ON library_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all users"
  ON library_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM library_users 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND status = 'active'
    )
  );

-- RLS Policies for activity_logs
CREATE POLICY "Activity logs are viewable by authenticated users"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Activity logs can be created by authenticated users"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM library_users 
      WHERE user_id = auth.uid() 
      AND status = 'active'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_borrow_records_updated_at BEFORE UPDATE ON borrow_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_users_updated_at BEFORE UPDATE ON library_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update book availability
CREATE OR REPLACE FUNCTION update_book_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    -- Decrease available copies when borrowing
    UPDATE books 
    SET available_copies = available_copies - 1
    WHERE id = NEW.book_id AND available_copies > 0;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status = 'returned' THEN
    -- Increase available copies when returning
    UPDATE books 
    SET available_copies = available_copies + 1
    WHERE id = NEW.book_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger for book availability
CREATE TRIGGER update_book_availability_trigger
  AFTER INSERT OR UPDATE ON borrow_records
  FOR EACH ROW EXECUTE FUNCTION update_book_availability();

-- Function to update member borrow counts
CREATE OR REPLACE FUNCTION update_member_borrow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    -- Increase borrow counts when borrowing
    UPDATE members 
    SET total_borrows = total_borrows + 1,
        current_borrows = current_borrows + 1
    WHERE id = NEW.member_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status = 'returned' THEN
    -- Decrease current borrows and add penalty when returning
    UPDATE members 
    SET current_borrows = current_borrows - 1,
        penalties = penalties + NEW.penalty
    WHERE id = NEW.member_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger for member borrow counts
CREATE TRIGGER update_member_borrow_counts_trigger
  AFTER INSERT OR UPDATE ON borrow_records
  FOR EACH ROW EXECUTE FUNCTION update_member_borrow_counts();