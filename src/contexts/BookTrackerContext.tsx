import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AppState, Book, Note } from "../types";

// Local storage keys
const STORAGE_KEYS = {
    BOOKS: "bookTracker_books",
    NOTES: "bookTracker_notes",
    GOALS: "bookTracker_goals",
    SESSIONS: "bookTracker_sessions",
    SETTINGS: "bookTracker_settings",
};

// Default state
const defaultState: AppState = {
    books: [],
    notes: [],
    goals: [],
    sessions: [],
    settings: {
        reminderEnabled: false,
        reminderDays: ["Monday", "Wednesday", "Friday"],
        reminderTime: "19:00",
        defaultGoals: {
            booksPerMonth: 2,
            pagesPerDay: 20,
        },
    },
};

// Create context
interface BookTrackerContextType {
    state: AppState;
    addBook: (book: Omit<Book, "id" | "dateAdded">) => Book;
    updateBook: (id: string, updates: Partial<Book>) => void;
    deleteBook: (id: string) => void;
    addNote: (note: Omit<Note, "id" | "dateCreated">) => Note;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;
    // Helper functions
    getCurrentlyReading: () => Book[];
    getRecentNotes: (limit?: number) => Note[];
    getStats: () => {
        totalBooks: number;
        booksRead: number;
        currentlyReading: number;
        totalPages: number;
        pagesRead: number;
    };
    searchNotes: (query: string) => Note[];
    getBookById: (id: string) => Book | undefined;
}

const BookTrackerContext = createContext<BookTrackerContextType | undefined>(
    undefined
);

// Provider component
export const BookTrackerProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [state, setState] = useState<AppState>(defaultState);

    // Load data from localStorage on mount
    useEffect(() => {
        const loadData = () => {
            try {
                const books = JSON.parse(
                    localStorage.getItem(STORAGE_KEYS.BOOKS) || "[]"
                );
                const notes = JSON.parse(
                    localStorage.getItem(STORAGE_KEYS.NOTES) || "[]"
                );
                const goals = JSON.parse(
                    localStorage.getItem(STORAGE_KEYS.GOALS) || "[]"
                );
                const sessions = JSON.parse(
                    localStorage.getItem(STORAGE_KEYS.SESSIONS) || "[]"
                );
                const settings = JSON.parse(
                    localStorage.getItem(STORAGE_KEYS.SETTINGS) ||
                        JSON.stringify(defaultState.settings)
                );

                setState({
                    books: books.map((book: any) => ({
                        ...book,
                        dateAdded: new Date(book.dateAdded),
                        dateStarted: book.dateStarted
                            ? new Date(book.dateStarted)
                            : undefined,
                        dateFinished: book.dateFinished
                            ? new Date(book.dateFinished)
                            : undefined,
                    })),
                    notes: notes.map((note: any) => ({
                        ...note,
                        dateCreated: new Date(note.dateCreated),
                        dateModified: note.dateModified
                            ? new Date(note.dateModified)
                            : undefined,
                    })),
                    goals,
                    sessions: sessions.map((session: any) => ({
                        ...session,
                        date: new Date(session.date),
                    })),
                    settings,
                });
            } catch (error) {
                console.error("Error loading data from localStorage:", error);
            }
        };

        loadData();
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(state.books));
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(state.notes));
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(state.goals));
        localStorage.setItem(
            STORAGE_KEYS.SESSIONS,
            JSON.stringify(state.sessions)
        );
        localStorage.setItem(
            STORAGE_KEYS.SETTINGS,
            JSON.stringify(state.settings)
        );
    }, [state]);

    // Book operations
    const addBook = (book: Omit<Book, "id" | "dateAdded">) => {
        const newBook: Book = {
            ...book,
            id: Date.now().toString(),
            dateAdded: new Date(),
        };
        setState((prev) => ({ ...prev, books: [...prev.books, newBook] }));
        return newBook;
    };

    const updateBook = (id: string, updates: Partial<Book>) => {
        setState((prev) => ({
            ...prev,
            books: prev.books.map((book) =>
                book.id === id ? { ...book, ...updates } : book
            ),
        }));
    };

    const deleteBook = (id: string) => {
        setState((prev) => ({
            ...prev,
            books: prev.books.filter((book) => book.id !== id),
            notes: prev.notes.filter((note) => note.bookId !== id), // Also delete related notes
        }));
    };

    // Note operations
    const addNote = (note: Omit<Note, "id" | "dateCreated">) => {
        const newNote: Note = {
            ...note,
            id: Date.now().toString(),
            dateCreated: new Date(),
        };
        setState((prev) => ({ ...prev, notes: [...prev.notes, newNote] }));
        return newNote;
    };

    const updateNote = (id: string, updates: Partial<Note>) => {
        setState((prev) => ({
            ...prev,
            notes: prev.notes.map((note) =>
                note.id === id
                    ? { ...note, ...updates, dateModified: new Date() }
                    : note
            ),
        }));
    };

    const deleteNote = (id: string) => {
        setState((prev) => ({
            ...prev,
            notes: prev.notes.filter((note) => note.id !== id),
        }));
    };

    // Helper functions
    const getCurrentlyReading = () => {
        return state.books.filter((book) => book.status === "reading");
    };

    const getRecentNotes = (limit = 5) => {
        return state.notes
            .sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime())
            .slice(0, limit);
    };

    const getStats = () => {
        const totalBooks = state.books.length;
        const booksRead = state.books.filter(
            (book) => book.status === "finished"
        ).length;
        const currentlyReading = state.books.filter(
            (book) => book.status === "reading"
        ).length;
        const totalPages = state.books.reduce(
            (sum, book) => sum + book.totalPages,
            0
        );
        const pagesRead = state.books.reduce(
            (sum, book) => sum + book.currentPage,
            0
        );

        return {
            totalBooks,
            booksRead,
            currentlyReading,
            totalPages,
            pagesRead,
        };
    };

    const searchNotes = (query: string) => {
        if (!query.trim()) return state.notes;

        const lowerQuery = query.toLowerCase();
        return state.notes.filter(
            (note) =>
                note.content.toLowerCase().includes(lowerQuery) ||
                note.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
    };

    const getBookById = (id: string) => {
        return state.books.find((book) => book.id === id);
    };

    const value: BookTrackerContextType = {
        state,
        addBook,
        updateBook,
        deleteBook,
        addNote,
        updateNote,
        deleteNote,
        getCurrentlyReading,
        getRecentNotes,
        getStats,
        searchNotes,
        getBookById,
    };

    return (
        <BookTrackerContext.Provider value={value}>
            {children}
        </BookTrackerContext.Provider>
    );
};

// Custom hook to use the context
export const useBookTracker = () => {
    const context = useContext(BookTrackerContext);
    if (context === undefined) {
        throw new Error(
            "useBookTracker must be used within a BookTrackerProvider"
        );
    }
    return context;
};
