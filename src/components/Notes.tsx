import { useState } from "react";
import { useBookTracker } from "../contexts/BookTrackerContext";
import AddNoteModal from "./AddNoteModal";
import type { Note } from "../types";

function Notes() {
    // State for filtering and search - useState hook manages component state
    const [selectedBook, setSelectedBook] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

    // Get data from context
    const { state, getBookById, deleteNote } = useBookTracker();

    // Get real data
    const books = state.books;
    const allNotes = state.notes;

    // Filter notes based on selected book and search term
    const filteredNotes = allNotes.filter((note) => {
        const matchesBook =
            selectedBook === "all" || note.bookId === selectedBook;
        const matchesSearch =
            note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (note.tags &&
                note.tags.some((tag) =>
                    tag.toLowerCase().includes(searchTerm.toLowerCase())
                ));
        return matchesBook && matchesSearch;
    });

    return (
        <div
            className="h-100 overflow-auto px-3 py-3"
            style={{
                height: "calc(100vh - 80px)", // Same pattern as Home page for consistency
                paddingBottom: "20px",
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Notes</h1>
                {/* Bootstrap button with primary color - consistent with Bootstrap design system */}
                <button
                    className="btn btn-primary"
                    onClick={() => setIsAddNoteModalOpen(true)}
                    disabled={books.length === 0}
                >
                    <i className="bi bi-plus-lg me-2"></i>Add Note
                </button>
            </div>

            {/* Filters Section - Bootstrap card for organized content grouping */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        {" "}
                        {/* g-3 adds consistent gutters between columns */}
                        <div className="col-md-6">
                            {/* Form control for consistent input styling */}
                            <label htmlFor="bookFilter" className="form-label">
                                Filter by Book
                            </label>
                            <select
                                id="bookFilter"
                                className="form-select"
                                value={selectedBook}
                                onChange={(e) =>
                                    setSelectedBook(e.target.value)
                                }
                            >
                                <option value="all">All Books</option>
                                {books.map((book) => (
                                    <option key={book.id} value={book.id}>
                                        {book.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="searchNotes" className="form-label">
                                Search Notes
                            </label>
                            <input
                                type="text"
                                id="searchNotes"
                                className="form-control"
                                placeholder="Search by content or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes List - Using Bootstrap list group for structured content */}
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">
                            {filteredNotes.length} note
                            {filteredNotes.length !== 1 ? "s" : ""} found
                        </h5>
                        {/* Sort dropdown for better UX */}
                        <select
                            className="form-select form-select-sm"
                            style={{ width: "auto" }}
                        >
                            <option>Sort by Date (Newest)</option>
                            <option>Sort by Date (Oldest)</option>
                            <option>Sort by Page Number</option>
                            <option>Sort by Book</option>
                        </select>
                    </div>

                    {/* Notes Cards - Each note in its own card for clear separation */}
                    {filteredNotes.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="text-muted">
                                <i className="bi bi-journal-text fs-1 d-block mb-3"></i>
                                <h5>No notes found</h5>
                                <p>
                                    Try adjusting your filters or add your first
                                    note!
                                </p>
                            </div>
                        </div>
                    ) : (
                        filteredNotes.map((note) => (
                            <div key={note.id} className="card mb-3">
                                <div className="card-body">
                                    {/* Card header with book info and page number */}
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 className="card-title mb-1 text-primary">
                                                {getBookById(note.bookId)
                                                    ?.title || "Unknown Book"}
                                            </h6>
                                            <small className="text-muted">
                                                Page {note.page} •{" "}
                                                {note.dateCreated.toLocaleDateString()}
                                            </small>
                                        </div>
                                        {/* Dropdown menu for note actions */}
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
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setEditingNote(
                                                                note
                                                            );
                                                            setIsAddNoteModalOpen(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil me-2"></i>
                                                        Edit
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            // TODO: Implement share functionality
                                                            alert(
                                                                "Share functionality coming soon!"
                                                            );
                                                        }}
                                                    >
                                                        <i className="bi bi-share me-2"></i>
                                                        Share
                                                    </button>
                                                </li>
                                                <li>
                                                    <hr className="dropdown-divider" />
                                                </li>
                                                <li>
                                                    <button
                                                        className="dropdown-item text-danger"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Are you sure you want to delete this note?"
                                                                )
                                                            ) {
                                                                deleteNote(
                                                                    note.id
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <i className="bi bi-trash me-2"></i>
                                                        Delete
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Note content */}
                                    <p className="card-text">{note.content}</p>

                                    {/* Tags - Bootstrap badges for visual appeal */}
                                    {note.tags && note.tags.length > 0 && (
                                        <div className="mt-2">
                                            {note.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="badge bg-light text-dark me-2"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Note Modal */}
            <AddNoteModal
                isOpen={isAddNoteModalOpen}
                onClose={() => {
                    setIsAddNoteModalOpen(false);
                    setEditingNote(undefined);
                }}
                editNote={editingNote}
            />
        </div>
    );
}

export default Notes;
