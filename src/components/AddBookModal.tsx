import { useState } from "react";
import { useBookTracker } from "../contexts/BookTrackerContext";

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose }) => {
    const { addBook } = useBookTracker();

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        totalPages: "",
        coverUrl: "",
        genre: "",
        description: "",
        status: "to-read" as const,
    });

    // Form validation
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!formData.author.trim()) {
            newErrors.author = "Author is required";
        }

        if (!formData.totalPages || parseInt(formData.totalPages) < 1) {
            newErrors.totalPages = "Total pages must be a positive number";
        }

        if (formData.coverUrl && !isValidUrl(formData.coverUrl)) {
            newErrors.coverUrl = "Please enter a valid URL";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Simple URL validation
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Add book to your data
            const newBook = addBook({
                title: formData.title.trim(),
                author: formData.author.trim(),
                totalPages: parseInt(formData.totalPages),
                currentPage: 0, // Always start at page 0
                status: formData.status,
                coverUrl: formData.coverUrl.trim() || undefined,
                genre: formData.genre.trim() || undefined,
                description: formData.description.trim() || undefined,
            });

            console.log("✅ Book added successfully:", newBook);

            // Reset form and close modal
            resetForm();
            onClose();
        } catch (error) {
            console.error("❌ Error adding book:", error);
            setErrors({ submit: "Failed to add book. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: "",
            author: "",
            totalPages: "",
            coverUrl: "",
            genre: "",
            description: "",
            status: "to-read",
        });
        setErrors({});
    };

    // Close modal and reset form
    const handleClose = () => {
        resetForm();
        onClose();
    };

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
                    onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
                >
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title">📚 Add New Book</h5>
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
                                <div className="row g-3">
                                    {/* Title */}
                                    <div className="col-md-8">
                                        <label
                                            htmlFor="title"
                                            className="form-label"
                                        >
                                            Title{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.title ? "is-invalid" : ""
                                            }`}
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter book title..."
                                            disabled={isSubmitting}
                                        />
                                        {errors.title && (
                                            <div className="invalid-feedback">
                                                {errors.title}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="col-md-4">
                                        <label
                                            htmlFor="status"
                                            className="form-label"
                                        >
                                            Status
                                        </label>
                                        <select
                                            className="form-select"
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        >
                                            <option value="to-read">
                                                📚 To Read
                                            </option>
                                            <option value="reading">
                                                📖 Currently Reading
                                            </option>
                                            <option value="finished">
                                                ✅ Finished
                                            </option>
                                            <option value="paused">
                                                ⏸️ Paused
                                            </option>
                                        </select>
                                    </div>

                                    {/* Author */}
                                    <div className="col-md-8">
                                        <label
                                            htmlFor="author"
                                            className="form-label"
                                        >
                                            Author{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.author
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            id="author"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleChange}
                                            placeholder="Enter author name..."
                                            disabled={isSubmitting}
                                        />
                                        {errors.author && (
                                            <div className="invalid-feedback">
                                                {errors.author}
                                            </div>
                                        )}
                                    </div>

                                    {/* Total Pages */}
                                    <div className="col-md-4">
                                        <label
                                            htmlFor="totalPages"
                                            className="form-label"
                                        >
                                            Total Pages{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${
                                                errors.totalPages
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            id="totalPages"
                                            name="totalPages"
                                            value={formData.totalPages}
                                            onChange={handleChange}
                                            placeholder="300"
                                            min="1"
                                            disabled={isSubmitting}
                                        />
                                        {errors.totalPages && (
                                            <div className="invalid-feedback">
                                                {errors.totalPages}
                                            </div>
                                        )}
                                    </div>

                                    {/* Genre */}
                                    <div className="col-md-6">
                                        <label
                                            htmlFor="genre"
                                            className="form-label"
                                        >
                                            Genre
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="genre"
                                            name="genre"
                                            value={formData.genre}
                                            onChange={handleChange}
                                            placeholder="e.g., Programming, Fiction, Self-Help..."
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Cover URL */}
                                    <div className="col-md-6">
                                        <label
                                            htmlFor="coverUrl"
                                            className="form-label"
                                        >
                                            Cover Image URL
                                        </label>
                                        <input
                                            type="url"
                                            className={`form-control ${
                                                errors.coverUrl
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            id="coverUrl"
                                            name="coverUrl"
                                            value={formData.coverUrl}
                                            onChange={handleChange}
                                            placeholder="https://example.com/book-cover.jpg"
                                            disabled={isSubmitting}
                                        />
                                        {errors.coverUrl && (
                                            <div className="invalid-feedback">
                                                {errors.coverUrl}
                                            </div>
                                        )}
                                        <div className="form-text">
                                            Optional: Add a link to the book's
                                            cover image
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="col-12">
                                        <label
                                            htmlFor="description"
                                            className="form-label"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Brief description of the book (optional)..."
                                            disabled={isSubmitting}
                                        />
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
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>
                                        Adding Book...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-lg me-2"></i>
                                        Add Book
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

export default AddBookModal;
