import { useState } from "react";
import { useBookTracker } from "../contexts/BookTrackerContext";
import AddBookModal from "./AddBookModal";
import AddNoteModal from "./AddNoteModal";

function Library() {
    // State for filtering and view management
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("dateAdded");
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
    const [selectedBookForNote, setSelectedBookForNote] = useState<string>("");

    // Get real data from context
    const { state, updateBook } = useBookTracker();

    // Get real books from context
    const books = state.books;

    // Filter and sort books
    const filteredBooks = books
        .filter((book) => {
            const matchesStatus =
                statusFilter === "all" || book.status === statusFilter;
            const matchesSearch =
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "title":
                    return a.title.localeCompare(b.title);
                case "author":
                    return a.author.localeCompare(b.author);
                case "dateAdded":
                    return b.dateAdded.getTime() - a.dateAdded.getTime();
                case "progress":
                    const progressA =
                        a.status === "finished"
                            ? 100
                            : (a.currentPage / a.totalPages) * 100;
                    const progressB =
                        b.status === "finished"
                            ? 100
                            : (b.currentPage / b.totalPages) * 100;
                    return progressB - progressA;
                default:
                    return 0;
            }
        });

    // Helper functions
    const getProgress = (book: any) => {
        if (book.status === "finished") return 100;
        if (book.status === "to-read") return 0;
        return Math.round((book.currentPage / book.totalPages) * 100);
    };

    // Quick progress update
    const quickProgressUpdate = (book: any) => {
        const newPage = prompt(
            `Update reading progress for "${book.title}"\nCurrent page: ${book.currentPage}/${book.totalPages}\n\nEnter new page number:`,
            book.currentPage.toString()
        );

        if (newPage && !isNaN(parseInt(newPage))) {
            const pageNum = parseInt(newPage);
            if (pageNum >= 0 && pageNum <= book.totalPages) {
                const updates: any = { currentPage: pageNum };

                // Auto-update status based on progress
                if (pageNum === 0) updates.status = "to-read";
                else if (pageNum === book.totalPages)
                    updates.status = "finished";
                else if (book.status === "to-read") updates.status = "reading";

                updateBook(book.id, updates);
            } else {
                alert(`Page number must be between 0 and ${book.totalPages}`);
            }
        }
    };

    // Open note modal for specific book
    const openNoteModalForBook = (bookId: string) => {
        setSelectedBookForNote(bookId);
        setIsAddNoteModalOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "reading":
                return <span className="badge bg-primary">📖 Reading</span>;
            case "finished":
                return <span className="badge bg-success">✅ Finished</span>;
            case "to-read":
                return <span className="badge bg-secondary">📚 To Read</span>;
            default:
                return null;
        }
    };

    const renderStars = (rating: number | null) => {
        if (!rating) return <span className="text-muted">Not rated</span>;
        return (
            <div className="text-warning">
                {"★".repeat(rating)}
                {"☆".repeat(5 - rating)}
                <span className="text-muted ms-1">({rating}/5)</span>
            </div>
        );
    };

    return (
        <div
            className="overflow-auto px-3 py-3"
            style={{
                height: "calc(100vh - 100px)", // Subtract navbar height
                paddingBottom: "20px", // Extra padding at bottom
            }}
        >
            {/* Header with Add Book Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">📚 My Library</h1>
                    <p className="text-muted mb-0">
                        {filteredBooks.length} book
                        {filteredBooks.length !== 1 ? "s" : ""} found
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsAddBookModalOpen(true)}
                >
                    <i className="bi bi-plus-lg me-2"></i>Add New Book
                </button>
            </div>

            {/* Filters and Controls */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        {/* Search */}
                        <div className="col-md-4">
                            <label htmlFor="searchBooks" className="form-label">
                                Search Books
                            </label>
                            <input
                                type="text"
                                id="searchBooks"
                                className="form-control"
                                placeholder="Search by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="col-md-3">
                            <label
                                htmlFor="statusFilter"
                                className="form-label"
                            >
                                Filter by Status
                            </label>
                            <select
                                id="statusFilter"
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value="all">All Books</option>
                                <option value="reading">
                                    Currently Reading
                                </option>
                                <option value="to-read">To Read</option>
                                <option value="finished">Finished</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="col-md-3">
                            <label htmlFor="sortBy" className="form-label">
                                Sort by
                            </label>
                            <select
                                id="sortBy"
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="dateAdded">Date Added</option>
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                                <option value="progress">Progress</option>
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="col-md-2">
                            <label className="form-label">View</label>
                            <div className="btn-group d-block" role="group">
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="viewMode"
                                    id="gridView"
                                    value="grid"
                                    checked={viewMode === "grid"}
                                    onChange={(e) =>
                                        setViewMode(e.target.value)
                                    }
                                />
                                <label
                                    className="btn btn-outline-secondary btn-sm"
                                    htmlFor="gridView"
                                >
                                    <i className="bi bi-grid-3x3-gap"></i>
                                </label>

                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="viewMode"
                                    id="listView"
                                    value="list"
                                    checked={viewMode === "list"}
                                    onChange={(e) =>
                                        setViewMode(e.target.value)
                                    }
                                />
                                <label
                                    className="btn btn-outline-secondary btn-sm"
                                    htmlFor="listView"
                                >
                                    <i className="bi bi-list-ul"></i>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Books Display */}
            {filteredBooks.length === 0 ? (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <i className="bi bi-book fs-1 d-block mb-3"></i>
                        <h5>No books found</h5>
                        <p>
                            Try adjusting your filters or add your first book!
                        </p>
                        <button className="btn btn-primary">
                            Add Your First Book
                        </button>
                    </div>
                </div>
            ) : viewMode === "grid" ? (
                /* Grid View */
                <div className="row">
                    {filteredBooks.map((book) => (
                        <div
                            className="col-6 col-md-4 col-lg-3 mb-4"
                            key={book.id}
                        >
                            <div className="card h-100 position-relative">
                                {/* Status Badge */}
                                <div
                                    className="position-absolute top-0 end-0 m-2"
                                    style={{ zIndex: 1 }}
                                >
                                    {getStatusBadge(book.status)}
                                </div>

                                <img
                                    src={
                                        book.coverUrl ||
                                        "https://via.placeholder.com/150x200?text=No+Cover"
                                    }
                                    className="card-img-top"
                                    style={{
                                        height: "250px",
                                        objectFit: "cover",
                                    }}
                                    alt={book.title}
                                />

                                <div className="card-body d-flex flex-column">
                                    <h6
                                        className="card-title"
                                        title={book.title}
                                    >
                                        {book.title}
                                    </h6>
                                    <p className="card-text text-muted small mb-2">
                                        {book.author}
                                    </p>

                                    {/* Rating */}
                                    <div className="mb-2 small">
                                        {renderStars(book.rating || null)}
                                    </div>

                                    {/* Progress */}
                                    {book.status !== "to-read" && (
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <small className="text-muted">
                                                    Progress
                                                </small>
                                                <div className="d-flex align-items-center gap-2">
                                                    <small className="fw-bold">
                                                        {getProgress(book)}%
                                                    </small>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        style={{
                                                            fontSize: "0.7rem",
                                                            padding: "2px 6px",
                                                        }}
                                                        onClick={() =>
                                                            quickProgressUpdate(
                                                                book
                                                            )
                                                        }
                                                        title="Update progress"
                                                    >
                                                        📖
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                className="progress"
                                                style={{ height: "4px" }}
                                            >
                                                <div
                                                    className={`progress-bar ${
                                                        book.status ===
                                                        "finished"
                                                            ? "bg-success"
                                                            : "bg-primary"
                                                    }`}
                                                    style={{
                                                        width: `${getProgress(
                                                            book
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <small className="text-muted">
                                                {book.currentPage} /{" "}
                                                {book.totalPages} pages
                                            </small>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-auto">
                                        <div className="d-grid gap-2">
                                            {book.status === "reading" && (
                                                <button className="btn btn-primary btn-sm">
                                                    Continue Reading
                                                </button>
                                            )}
                                            {book.status === "to-read" && (
                                                <button className="btn btn-outline-primary btn-sm">
                                                    Start Reading
                                                </button>
                                            )}
                                            {book.status === "finished" && (
                                                <button className="btn btn-outline-success btn-sm">
                                                    View Details
                                                </button>
                                            )}
                                            {/* Add Note button for all books */}
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() =>
                                                    openNoteModalForBook(
                                                        book.id
                                                    )
                                                }
                                            >
                                                <i className="bi bi-pencil me-1"></i>
                                                Add Note
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="list-group">
                    {filteredBooks.map((book) => (
                        <div key={book.id} className="list-group-item">
                            <div className="d-flex align-items-center">
                                <img
                                    src={
                                        book.coverUrl ||
                                        "https://via.placeholder.com/60x90?text=No+Cover"
                                    }
                                    alt={book.title}
                                    className="rounded me-3"
                                    style={{
                                        width: "60px",
                                        height: "90px",
                                        objectFit: "cover",
                                    }}
                                />

                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                        <h6 className="mb-0">{book.title}</h6>
                                        {getStatusBadge(book.status)}
                                    </div>
                                    <p className="mb-1 text-muted">
                                        {book.author}
                                    </p>

                                    <div className="d-flex align-items-center mb-2">
                                        <div className="me-3">
                                            {renderStars(book.rating || null)}
                                        </div>
                                        <small className="text-muted">
                                            Added{" "}
                                            {book.dateAdded.toLocaleDateString()}
                                        </small>
                                    </div>

                                    {/* Progress bar for list view */}
                                    {book.status !== "to-read" && (
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="progress me-3"
                                                style={{
                                                    width: "200px",
                                                    height: "6px",
                                                }}
                                            >
                                                <div
                                                    className={`progress-bar ${
                                                        book.status ===
                                                        "finished"
                                                            ? "bg-success"
                                                            : "bg-primary"
                                                    }`}
                                                    style={{
                                                        width: `${getProgress(
                                                            book
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <small className="text-muted">
                                                    {book.currentPage}/
                                                    {book.totalPages} (
                                                    {getProgress(book)}%)
                                                </small>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    style={{
                                                        fontSize: "0.7rem",
                                                        padding: "2px 6px",
                                                    }}
                                                    onClick={() =>
                                                        quickProgressUpdate(
                                                            book
                                                        )
                                                    }
                                                    title="Update progress"
                                                >
                                                    📖
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="ms-3">
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                        >
                                            Actions
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    <i className="bi bi-eye me-2"></i>
                                                    View Details
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    <i className="bi bi-pencil me-2"></i>
                                                    Edit
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    <i className="bi bi-journal-text me-2"></i>
                                                    Notes
                                                </a>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <a
                                                    className="dropdown-item text-danger"
                                                    href="#"
                                                >
                                                    <i className="bi bi-trash me-2"></i>
                                                    Remove
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            <AddBookModal
                isOpen={isAddBookModalOpen}
                onClose={() => setIsAddBookModalOpen(false)}
            />
            <AddNoteModal
                isOpen={isAddNoteModalOpen}
                onClose={() => {
                    setIsAddNoteModalOpen(false);
                    setSelectedBookForNote("");
                }}
                preSelectedBookId={selectedBookForNote}
            />
        </div>
    );
}

export default Library;
