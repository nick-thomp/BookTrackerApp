// Core data types for the Book Notes & Progress Tracker App

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: 'reading' | 'finished' | 'to-read' | 'paused';
  dateAdded: Date;
  dateStarted?: Date;
  dateFinished?: Date;
  coverUrl?: string;
  rating?: number; // 1-5 stars
  genre?: string;
  description?: string;
}

export interface Note {
  id: string;
  bookId: string;
  page: number;
  content: string;
  dateCreated: Date;
  dateModified?: Date;
  tags?: string[];
}

export interface ReadingGoal {
  id: string;
  type: 'books' | 'pages' | 'minutes';
  target: number;
  period: 'weekly' | 'monthly' | 'yearly';
  current: number;
  dateCreated: Date;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  startPage: number;
  endPage: number;
  duration: number; // minutes
  date: Date;
}

// App state type
export interface AppState {
  books: Book[];
  notes: Note[];
  goals: ReadingGoal[];
  sessions: ReadingSession[];
  settings: {
    reminderEnabled: boolean;
    reminderDays: string[];
    reminderTime: string;
    defaultGoals: {
      booksPerMonth: number;
      pagesPerDay: number;
    };
  };
}