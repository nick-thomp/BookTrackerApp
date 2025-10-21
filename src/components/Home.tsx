import { useState } from "react";
import { useBookTracker } from "../contexts/BookTrackerContext";
import AddBookModal from "./AddBookModal";
import AddNoteModal from "./AddNoteModal";
import type { Book } from "../types";

function Home() {
    // State for managing what content to show
    const [showAllRecentBooks, setShowAllRecentBooks] = useState(false);
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

    // Get data from context
    const {
        state,
        getCurrentlyReading,
        getRecentNotes,
        getStats,
        getBookById,
    } = useBookTracker();

    // Get currently reading books for the dashboard
    const currentlyReading = getCurrentlyReading();
    const recentBooks = showAllRecentBooks
        ? state.books
        : state.books.slice(0, 4);
    const stats = getStats();

    // Calculate reading progress
    const getProgress = (book: any) => {
        if (book.status === "finished") return 100;
        if (book.status === "to-read") return 0;
        return Math.round((book.currentPage / book.totalPages) * 100);
    };

    // Get recent notes with book titles
    const recentNotes = getRecentNotes(3);

    return (
        <div
            className="overflow-auto px-3 py-3"
            style={{
                height: "calc(100vh - 100px)", // Subtract navbar height
                paddingBottom: "20px", // Extra padding at bottom
            }}
        >
            {/* Welcome Header with Quick Actions */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">
                        Good{" "}
                        {new Date().getHours() < 12
                            ? "Morning"
                            : new Date().getHours() < 18
                            ? "Afternoon"
                            : "Evening"}
                        ! 👋
                    </h1>
                    <p className="text-muted mb-0">
                        Ready to continue your reading journey?
                    </p>
                </div>
                {/* Quick action buttons */}
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setIsAddNoteModalOpen(true)}
                        disabled={state.books.length === 0}
                        title={
                            state.books.length === 0
                                ? "Add a book first to create notes"
                                : ""
                        }
                    >
                        <i className="bi bi-pencil me-2"></i>Add Note
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsAddBookModalOpen(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i>Add Book
                    </button>
                </div>
            </div>

            {/* Currently Reading - Priority Section */}
            {currentlyReading.length > 0 && (
                <div className="card border-primary mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">📖 Continue Reading</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {currentlyReading.map((book) => (
                                <div key={book.id} className="col-md-6 mb-3">
                                    <div className="d-flex">
                                        <img
                                            src={
                                                book.coverUrl ||
                                                "https://via.placeholder.com/80x120?text=No+Cover"
                                            }
                                            alt={book.title}
                                            className="rounded me-3"
                                            style={{
                                                width: "80px",
                                                height: "120px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">
                                                {book.title}
                                            </h6>
                                            <p className="text-muted small mb-2">
                                                {book.author}
                                            </p>

                                            {/* Progress bar */}
                                            <div className="mb-2">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <small className="text-muted">
                                                        Progress
                                                    </small>
                                                    <small className="fw-bold">
                                                        {getProgress(book)}%
                                                    </small>
                                                </div>
                                                <div
                                                    className="progress"
                                                    style={{ height: "6px" }}
                                                >
                                                    <div
                                                        className="progress-bar bg-primary"
                                                        style={{
                                                            width: `${getProgress(
                                                                book
                                                            )}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <small className="text-muted">
                                                    Page {book.currentPage} of{" "}
                                                    {book.totalPages}
                                                </small>
                                            </div>

                                            <button className="btn btn-sm btn-outline-primary">
                                                Continue Reading
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Stats Dashboard */}
            <div className="row mb-4">
                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center h-100">
                        <div className="card-body">
                            <div className="text-primary fs-1">📚</div>
                            <h4 className="card-title">{stats.totalBooks}</h4>
                            <p className="card-text small text-muted">
                                Total Books
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center h-100">
                        <div className="card-body">
                            <div className="text-success fs-1">✅</div>
                            <h4 className="card-title">{stats.booksRead}</h4>
                            <p className="card-text small text-muted">
                                Completed
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center h-100">
                        <div className="card-body">
                            <div className="text-warning fs-1">📖</div>
                            <h4 className="card-title">
                                {stats.currentlyReading}
                            </h4>
                            <p className="card-text small text-muted">
                                Currently Reading
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center h-100">
                        <div className="card-body">
                            <div className="text-info fs-1">📝</div>
                            <h4 className="card-title">{state.notes.length}</h4>
                            <p className="card-text small text-muted">
                                Total Notes
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Books Section */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">📚 Recent Books</h5>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                            setShowAllRecentBooks(!showAllRecentBooks)
                        }
                    >
                        {showAllRecentBooks ? "Show Less" : "View All"}
                    </button>
                </div>
                <div className="row">
                    {recentBooks.map((book: Book) => (
                        <div
                            className="col-6 col-md-4 col-lg-3 mb-3"
                            key={book.id}
                        >
                            <div className="card h-100 position-relative">
                                {/* Status badge */}
                                <span
                                    className={`position-absolute top-0 start-0 m-2 badge ${
                                        book.status === "reading"
                                            ? "bg-primary"
                                            : book.status === "finished"
                                            ? "bg-success"
                                            : "bg-secondary"
                                    }`}
                                    style={{ zIndex: 1 }}
                                >
                                    {book.status === "reading"
                                        ? "📖"
                                        : book.status === "finished"
                                        ? "✅"
                                        : "📚"}
                                </span>

                                <img
                                    src={
                                        book.coverUrl ||
                                        "https://via.placeholder.com/200x250?text=No+Cover"
                                    }
                                    className="card-img-top"
                                    style={{
                                        height: "200px",
                                        objectFit: "cover",
                                    }}
                                    alt={book.title}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h6
                                        className="card-title text-truncate"
                                        title={book.title}
                                    >
                                        {book.title}
                                    </h6>
                                    <p className="card-text text-truncate text-muted small">
                                        {book.author}
                                    </p>

                                    {/* Progress for reading books */}
                                    {book.status === "reading" && (
                                        <div className="mt-auto">
                                            <div
                                                className="progress mb-1"
                                                style={{ height: "4px" }}
                                            >
                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width: `${getProgress(
                                                            book
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <small className="text-muted">
                                                {getProgress(book)}% complete
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Notes Section */}
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">📝 Recent Notes</h5>
                        <a href="#" className="btn btn-sm btn-outline-primary">
                            View All Notes
                        </a>
                    </div>
                </div>
                <div className="card-body">
                    {recentNotes.length === 0 ? (
                        <div className="text-center py-4">
                            <div className="text-muted">
                                <i className="bi bi-journal-text fs-1 d-block mb-2"></i>
                                <p>
                                    No notes yet. Start taking notes as you
                                    read!
                                </p>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setIsAddNoteModalOpen(true)}
                                    disabled={state.books.length === 0}
                                >
                                    {state.books.length === 0
                                        ? "Add a Book First"
                                        : "Add Your First Note"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            {recentNotes.slice(0, 3).map((note) => (
                                <div key={note.id} className="col-md-4 mb-3">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="text-primary mb-0 small">
                                                {getBookById(note.bookId)
                                                    ?.title || "Unknown Book"}
                                            </h6>
                                            <span className="badge bg-light text-dark">
                                                p.{note.page}
                                            </span>
                                        </div>
                                        <p
                                            className="small mb-2 text-truncate-3"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {note.content}
                                        </p>
                                        <small className="text-muted">
                                            {note.dateCreated.toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddBookModal
                isOpen={isAddBookModalOpen}
                onClose={() => setIsAddBookModalOpen(false)}
            />
            <AddNoteModal
                isOpen={isAddNoteModalOpen}
                onClose={() => setIsAddNoteModalOpen(false)}
            />
        </div>
    );
}

export default Home;
