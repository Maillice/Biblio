export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          isbn: string;
          category: string;
          language: string;
          level: string;
          publication_year: number | null;
          pages: number;
          publisher: string;
          status: 'available' | 'borrowed' | 'reserved' | 'maintenance';
          total_copies: number;
          available_copies: number;
          location: string;
          description: string;
          cover_image: string | null;
          added_date: string;
          last_updated: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          isbn: string;
          category: string;
          language?: string;
          level?: string;
          publication_year?: number | null;
          pages?: number;
          publisher?: string;
          status?: 'available' | 'borrowed' | 'reserved' | 'maintenance';
          total_copies?: number;
          available_copies?: number;
          location?: string;
          description?: string;
          cover_image?: string | null;
          added_date?: string;
          last_updated?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string;
          isbn?: string;
          category?: string;
          language?: string;
          level?: string;
          publication_year?: number | null;
          pages?: number;
          publisher?: string;
          status?: 'available' | 'borrowed' | 'reserved' | 'maintenance';
          total_copies?: number;
          available_copies?: number;
          location?: string;
          description?: string;
          cover_image?: string | null;
          added_date?: string;
          last_updated?: string;
        };
      };
      members: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          address: string;
          membership_type: 'standard' | 'premium' | 'student';
          join_date: string;
          expiry_date: string;
          status: 'active' | 'suspended' | 'expired';
          total_borrows: number;
          current_borrows: number;
          penalties: number;
          qr_code: string;
          profile_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          address: string;
          membership_type?: 'standard' | 'premium' | 'student';
          join_date?: string;
          expiry_date?: string;
          status?: 'active' | 'suspended' | 'expired';
          total_borrows?: number;
          current_borrows?: number;
          penalties?: number;
          qr_code: string;
          profile_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          membership_type?: 'standard' | 'premium' | 'student';
          join_date?: string;
          expiry_date?: string;
          status?: 'active' | 'suspended' | 'expired';
          total_borrows?: number;
          current_borrows?: number;
          penalties?: number;
          qr_code?: string;
          profile_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      borrow_records: {
        Row: {
          id: string;
          book_id: string;
          member_id: string;
          borrow_date: string;
          due_date: string;
          return_date: string | null;
          status: 'active' | 'returned' | 'overdue';
          renewal_count: number;
          penalty: number;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          member_id: string;
          borrow_date?: string;
          due_date: string;
          return_date?: string | null;
          status?: 'active' | 'returned' | 'overdue';
          renewal_count?: number;
          penalty?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          member_id?: string;
          borrow_date?: string;
          due_date?: string;
          return_date?: string | null;
          status?: 'active' | 'returned' | 'overdue';
          renewal_count?: number;
          penalty?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          book_id: string;
          member_id: string;
          reservation_date: string;
          status: 'pending' | 'fulfilled' | 'cancelled' | 'expired';
          notification_sent: boolean;
          priority: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          member_id: string;
          reservation_date?: string;
          status?: 'pending' | 'fulfilled' | 'cancelled' | 'expired';
          notification_sent?: boolean;
          priority?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          member_id?: string;
          reservation_date?: string;
          status?: 'pending' | 'fulfilled' | 'cancelled' | 'expired';
          notification_sent?: boolean;
          priority?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      library_users: {
        Row: {
          id: string;
          user_id: string | null;
          username: string;
          email: string;
          role: 'admin' | 'librarian' | 'reader';
          first_name: string;
          last_name: string;
          last_login: string | null;
          status: 'active' | 'inactive';
          permissions: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          username: string;
          email: string;
          role?: 'admin' | 'librarian' | 'reader';
          first_name: string;
          last_name: string;
          last_login?: string | null;
          status?: 'active' | 'inactive';
          permissions?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          username?: string;
          email?: string;
          role?: 'admin' | 'librarian' | 'reader';
          first_name?: string;
          last_name?: string;
          last_login?: string | null;
          status?: 'active' | 'inactive';
          permissions?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: 'book' | 'member' | 'borrow' | 'reservation';
          entity_id: string;
          details: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: 'book' | 'member' | 'borrow' | 'reservation';
          entity_id: string;
          details: string;
          timestamp?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: 'book' | 'member' | 'borrow' | 'reservation';
          entity_id?: string;
          details?: string;
          timestamp?: string;
        };
      };
    };
  };
}