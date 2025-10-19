import { useState, useEffect } from "react";
import { useBookTracker } from "../contexts/BookTrackerContext";
import type { Note } from "../types";

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    editNote?: Note; // Optional - if provided, modal is in edit mode
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({
    isOpen,
    onClose,
    editNote,
}) => {
    const { state, addNote, updateNote, getBookById } = useBookTracker();

    // Form state
    const [formData, setFormData] = useState({
        bookId: "",
        page: "",
        content: "",
        tags: "", // Comma-separated string, we'll convert to array
    });

    // Form validation
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Set form data when editing
    useEffect(() => {
        if (editNote) {
            setFormData({
                bookId: editNote.bookId,
                page: editNote.page?.toString() || "",
                content: editNote.content,
                tags: editNote.tags?.join(", ") || "",
            });
        } else {
            // Reset form for new note
            setFormData({
                bookId: "",
                page: "",
                content: "",
                tags: "",
            });
        }
        setErrors({});
    }, [editNote, isOpen]);

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.bookId) {
            newErrors.bookId = "Please select a book";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Note content is required";
        }

        // Validate page number (required)
        if (!formData.page) {
            newErrors.page = "Page number is required";
        } else {
            const pageNum = parseInt(formData.page);
            if (isNaN(pageNum) || pageNum < 1) {
                newErrors.page = "Page must be a positive number";
            } else {
                const selectedBook = getBookById(formData.bookId);
                if (selectedBook && pageNum > selectedBook.totalPages) {
                    newErrors.page = `Page cannot exceed ${selectedBook.totalPages} (book's total pages)`;
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Parse tags from comma-separated string
            const tags = formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);

            const noteData = {
                bookId: formData.bookId,
                page: parseInt(formData.page), // We validated it's not empty above
                content: formData.content.trim(),
                tags: tags.length > 0 ? tags : undefined,
            };

            if (editNote) {
                // Update existing note
                updateNote(editNote.id, noteData);
                console.log("✅ Note updated successfully");
            } else {
                // Add new note
                const newNote = addNote(noteData);
                console.log("✅ Note added successfully:", newNote);
            }

            // Reset form and close modal
            resetForm();
            onClose();
        } catch (error) {
            console.error("❌ Error saving note:", error);
            setErrors({ submit: "Failed to save note. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            bookId: "",
            page: "",
            content: "",
            tags: "",
        });
        setErrors({});
    };

    // Close modal and reset form
    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Get available books for dropdown
    const availableBooks = state.books;
    const selectedBook = getBookById(formData.bookId);

    if (!isOpen) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="modal fade show d-block"
                tabIndex={-1}
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                onClick={handleClose}
            >
                <div
                    className="modal-dialog modal-dialog-centered modal-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {editNote ? "✏️ Edit Note" : "📝 Add New Note"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Book Selection */}
                                    <div className="col-md-8 mb-3">
                                        <label
                                            htmlFor="bookId"
                                            className="form-label"
                                        >
                                            Select Book *
                                        </label>
                                        <select
                                            id="bookId"
                                            name="bookId"
                                            className={`form-select ${
                                                errors.bookId
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formData.bookId}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        >
                                            <option value="">
                                                Choose a book...
                                            </option>
                                            {availableBooks.map((book) => (
                                                <option
                                                    key={book.id}
                                                    value={book.id}
                                                >
                                                    {book.title} by{" "}
                                                    {book.author}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.bookId && (
                                            <div className="invalid-feedback">
                                                {errors.bookId}
                                            </div>
                                        )}
                                        {availableBooks.length === 0 && (
                                            <div className="form-text text-warning">
                                                📚 No books available. Add a
                                                book first to create notes!
                                            </div>
                                        )}
                                    </div>

                                    {/* Page Number */}
                                    <div className="col-md-4 mb-3">
                                        <label
                                            htmlFor="page"
                                            className="form-label"
                                        >
                                            Page Number *
                                            {selectedBook && (
                                                <small className="text-muted">
                                                    {" "}
                                                    (1-{selectedBook.totalPages}
                                                    )
                                                </small>
                                            )}
                                        </label>
                                        <input
                                            type="number"
                                            id="page"
                                            name="page"
                                            className={`form-control ${
                                                errors.page ? "is-invalid" : ""
                                            }`}
                                            value={formData.page}
                                            onChange={handleChange}
                                            min="1"
                                            max={
                                                selectedBook?.totalPages ||
                                                undefined
                                            }
                                            placeholder="Enter page number"
                                            disabled={isSubmitting}
                                        />
                                        {errors.page && (
                                            <div className="invalid-feedback">
                                                {errors.page}
                                            </div>
                                        )}
                                    </div>

                                    {/* Note Content */}
                                    <div className="col-12 mb-3">
                                        <label
                                            htmlFor="content"
                                            className="form-label"
                                        >
                                            Note Content *
                                        </label>
                                        <textarea
                                            id="content"
                                            name="content"
                                            className={`form-control ${
                                                errors.content
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formData.content}
                                            onChange={handleChange}
                                            rows={6}
                                            placeholder="Write your thoughts, insights, quotes, or anything you want to remember about this part of the book..."
                                            disabled={isSubmitting}
                                        />
                                        {errors.content && (
                                            <div className="invalid-feedback">
                                                {errors.content}
                                            </div>
                                        )}
                                        <div className="form-text">
                                            💡 Tip: Include quotes, key
                                            insights, questions, or your
                                            personal reactions
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="col-12 mb-3">
                                        <label
                                            htmlFor="tags"
                                            className="form-label"
                                        >
                                            Tags
                                        </label>
                                        <input
                                            type="text"
                                            id="tags"
                                            name="tags"
                                            className="form-control"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            placeholder="quote, insight, question, important, character-development"
                                            disabled={isSubmitting}
                                        />
                                        <div className="form-text">
                                            🏷️ Separate tags with commas to
                                            organize your notes
                                        </div>
                                    </div>

                                    {/* Submit Error */}
                                    {errors.submit && (
                                        <div className="col-12">
                                            <div
                                                className="alert alert-danger"
                                                role="alert"
                                            >
                                                {errors.submit}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={
                                    isSubmitting || availableBooks.length === 0
                                }
                            >
                                {isSubmitting ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>
                                        {editNote
                                            ? "Updating..."
                                            : "Adding Note..."}
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-lg me-2"></i>
                                        {editNote ? "Update Note" : "Add Note"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddNoteModal;
