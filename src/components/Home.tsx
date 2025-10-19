import { useState } from "react";

function Home() {
    // State for managing what content to show
    const [showAllRecentBooks, setShowAllRecentBooks] = useState(false);

    const books = [
        {
            id: "1",
            title: "Programming in C",
            author: "K.N. King",
            cover: "https://m.media-amazon.com/images/I/51EyaJeebHL.jpg",
            dateAdded: "2025-10-10",
            currentPage: 145,
            totalPages: 320,
            status: "reading",
            description:
                "A comprehensive guide to C programming for beginners and experienced developers.",
        },
        {
            id: "2",
            title: "Clean Code",
            author: "Robert C. Martin",
            cover: "https://m.media-amazon.com/images/I/41xShlnTZTL.jpg",
            dateAdded: "2025-10-12",
            currentPage: 67,
            totalPages: 464,
            status: "reading",
            description:
                "Principles and best practices for writing clean, maintainable software.",
        },
        {
            id: "3",
            title: "The Pragmatic Programmer",
            author: "Andrew Hunt & David Thomas",
            cover: "https://m.media-amazon.com/images/I/51Wf5vF1YNL.jpg",
            dateAdded: "2025-10-14",
            currentPage: 0,
            totalPages: 352,
            status: "to-read",
            description:
                "Tips and techniques for becoming a better, more effective programmer.",
        },
        {
            id: "4",
            title: "JavaScript: The Good Parts",
            author: "Douglas Crockford",
            cover: "https://m.media-amazon.com/images/I/5188424824L.jpg",
            dateAdded: "2025-10-08",
            currentPage: 176,
            totalPages: 176,
            status: "finished",
            description: "Essential JavaScript concepts and best practices.",
        },
    ];

    // Get currently reading books for the dashboard
    const currentlyReading = books.filter((book) => book.status === "reading");
    const recentBooks = showAllRecentBooks ? books : books.slice(0, 4);

    // Calculate reading progress
    const getProgress = (book: any) => {
        if (book.status === "finished") return 100;
        if (book.status === "to-read") return 0;
        return Math.round((book.currentPage / book.totalPages) * 100);
    };

    // Mock recent notes - in real app, this would come from your notes data
    const recentNotes = [
        {
            id: "1",
            bookTitle: "Programming in C",
            page: 145,
            content:
                "Important concept about pointers and memory allocation. This explains why we need to be careful with malloc() and free().",
            date: "2025-10-15",
        },
        {
            id: "2",
            bookTitle: "Clean Code",
            page: 67,
            content:
                "Functions should do one thing and do it well. Single Responsibility Principle in action.",
            date: "2025-10-14",
        },
        {
            id: "3",
            bookTitle: "Programming in C",
            page: 89,
            content:
                "Arrays and strings relationship. Remember that strings are just arrays of characters.",
            date: "2025-10-13",
        },
    ];

    return (
        <div
            className="overflow-auto px-3 py-3"
            style={{
                height: "calc(100vh - 80px)", // Subtract navbar height
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
                {/* Quick action button */}
                <button className="btn btn-primary">
                    <i className="bi bi-plus-lg me-2"></i>Add Book
                </button>
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
                                            src={book.cover}
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
                            <h4 className="card-title">{books.length}</h4>
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
                            <h4 className="card-title">
                                {
                                    books.filter((b) => b.status === "finished")
                                        .length
                                }
                            </h4>
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
                                {currentlyReading.length}
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
                            <h4 className="card-title">{recentNotes.length}</h4>
                            <p className="card-text small text-muted">
                                Recent Notes
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
                    {recentBooks.map((book) => (
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
                                    src={book.cover}
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
                                <button className="btn btn-primary btn-sm">
                                    Add Your First Note
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
                                                {note.bookTitle}
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
                                            {note.date}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
