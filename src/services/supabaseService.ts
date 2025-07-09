import { supabase, handleSupabaseError } from '../lib/supabase';
import { Book, Member, BorrowRecord, Reservation, ActivityLog } from '../types';

// Book operations
export const bookService = {
  async create(bookData: Omit<Book, 'id' | 'addedDate' | 'lastUpdated'>) {
    const { data, error } = await supabase
      .from('books')
      .insert({
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn,
        category: bookData.category,
        language: bookData.language,
        level: bookData.level,
        publication_year: bookData.publicationYear,
        pages: bookData.pages,
        publisher: bookData.publisher,
        status: bookData.status,
        total_copies: bookData.totalCopies,
        available_copies: bookData.availableCopies,
        location: bookData.location,
        description: bookData.description,
        cover_image: bookData.coverImage
      })
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async update(id: string, updates: Partial<Book>) {
    const updateData: any = {};
    
    if (updates.title) updateData.title = updates.title;
    if (updates.author) updateData.author = updates.author;
    if (updates.isbn) updateData.isbn = updates.isbn;
    if (updates.category) updateData.category = updates.category;
    if (updates.language) updateData.language = updates.language;
    if (updates.level) updateData.level = updates.level;
    if (updates.publicationYear) updateData.publication_year = updates.publicationYear;
    if (updates.pages) updateData.pages = updates.pages;
    if (updates.publisher) updateData.publisher = updates.publisher;
    if (updates.status) updateData.status = updates.status;
    if (updates.totalCopies) updateData.total_copies = updates.totalCopies;
    if (updates.availableCopies !== undefined) updateData.available_copies = updates.availableCopies;
    if (updates.location) updateData.location = updates.location;
    if (updates.description) updateData.description = updates.description;
    if (updates.coverImage) updateData.cover_image = updates.coverImage;

    const { data, error } = await supabase
      .from('books')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) handleSupabaseError(error);
  }
};

// Member operations
export const memberService = {
  async create(memberData: Omit<Member, 'id' | 'joinDate' | 'qrCode'>) {
    const qrCode = `QR_${Date.now()}_${memberData.firstName}_${memberData.lastName}`.toUpperCase();
    
    const { data, error } = await supabase
      .from('members')
      .insert({
        first_name: memberData.firstName,
        last_name: memberData.lastName,
        email: memberData.email,
        phone: memberData.phone,
        address: memberData.address,
        membership_type: memberData.membershipType,
        expiry_date: memberData.expiryDate?.toISOString(),
        status: memberData.status,
        total_borrows: memberData.totalBorrows || 0,
        current_borrows: memberData.currentBorrows || 0,
        penalties: memberData.penalties || 0,
        qr_code: qrCode,
        profile_image: memberData.profileImage
      })
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async update(id: string, updates: Partial<Member>) {
    const updateData: any = {};
    
    if (updates.firstName) updateData.first_name = updates.firstName;
    if (updates.lastName) updateData.last_name = updates.lastName;
    if (updates.email) updateData.email = updates.email;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.address) updateData.address = updates.address;
    if (updates.membershipType) updateData.membership_type = updates.membershipType;
    if (updates.expiryDate) updateData.expiry_date = updates.expiryDate.toISOString();
    if (updates.status) updateData.status = updates.status;
    if (updates.totalBorrows !== undefined) updateData.total_borrows = updates.totalBorrows;
    if (updates.currentBorrows !== undefined) updateData.current_borrows = updates.currentBorrows;
    if (updates.penalties !== undefined) updateData.penalties = updates.penalties;
    if (updates.profileImage) updateData.profile_image = updates.profileImage;

    const { data, error } = await supabase
      .from('members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) handleSupabaseError(error);
  }
};

// Borrow operations
export const borrowService = {
  async create(bookId: string, memberId: string) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days from now

    const { data, error } = await supabase
      .from('borrow_records')
      .insert({
        book_id: bookId,
        member_id: memberId,
        due_date: dueDate.toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async return(borrowId: string) {
    const { data: borrow, error: fetchError } = await supabase
      .from('borrow_records')
      .select('due_date')
      .eq('id', borrowId)
      .single();

    if (fetchError) handleSupabaseError(fetchError);

    const returnDate = new Date();
    const dueDate = new Date(borrow.due_date);
    const isOverdue = returnDate > dueDate;
    const penalty = isOverdue ? Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) * 0.5 : 0;

    const { data, error } = await supabase
      .from('borrow_records')
      .update({
        return_date: returnDate.toISOString(),
        status: 'returned',
        penalty
      })
      .eq('id', borrowId)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async renew(borrowId: string) {
    const { data: borrow, error: fetchError } = await supabase
      .from('borrow_records')
      .select('due_date, renewal_count')
      .eq('id', borrowId)
      .single();

    if (fetchError) handleSupabaseError(fetchError);
    if (borrow.renewal_count >= 2) throw new Error('Maximum renewals reached');

    const newDueDate = new Date(borrow.due_date);
    newDueDate.setDate(newDueDate.getDate() + 14);

    const { data, error } = await supabase
      .from('borrow_records')
      .update({
        due_date: newDueDate.toISOString(),
        renewal_count: borrow.renewal_count + 1
      })
      .eq('id', borrowId)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }
};

// Reservation operations
export const reservationService = {
  async create(bookId: string, memberId: string) {
    // Get current priority for this book
    const { data: existingReservations, error: countError } = await supabase
      .from('reservations')
      .select('id')
      .eq('book_id', bookId)
      .eq('status', 'pending');

    if (countError) handleSupabaseError(countError);

    const priority = (existingReservations?.length || 0) + 1;

    const { data, error } = await supabase
      .from('reservations')
      .insert({
        book_id: bookId,
        member_id: memberId,
        status: 'pending',
        priority
      })
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  async cancel(reservationId: string) {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }
};

// Activity log operations
export const activityService = {
  async log(action: string, entityType: 'book' | 'member' | 'borrow' | 'reservation', entityId: string, details: string) {
    // Get current user from library_users table
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: libraryUser } = await supabase
      .from('library_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: libraryUser?.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details
      })
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }
};