import { useState } from "react";
import { useBookTracker } from "../contexts/BookTrackerContext";

function Stats() {
    // State for time period selection - allows users to switch between different views
    const [timePeriod, setTimePeriod] = useState("month");

    // Get real data from context
    const { state, getStats } = useBookTracker();
    const realStats = getStats();

    // Calculate additional metrics
    const calculateAverageRating = () => {
        const booksWithRatings = state.books.filter(
            (book) => book.rating && book.rating > 0
        );
        if (booksWithRatings.length === 0) return 0;
        const sum = booksWithRatings.reduce(
            (acc, book) => acc + (book.rating || 0),
            0
        );
        return Math.round((sum / booksWithRatings.length) * 10) / 10;
    };

    const calculateFavoriteGenre = () => {
        const genreCounts: Record<string, number> = {};
        state.books.forEach((book) => {
            if (book.genre) {
                genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
            }
        });

        const topGenre = Object.entries(genreCounts).sort(
            ([, a], [, b]) => b - a
        )[0];
        return topGenre ? topGenre[0] : "No genre data";
    };

    // Calculate stats from real data
    const stats = {
        currentMonth: {
            booksRead: realStats.booksRead,
            pagesRead: realStats.pagesRead,
            readingTime: Math.round((realStats.pagesRead / 25) * 10) / 10, // Estimate: ~25 pages/hour
            averageSession: Math.round(
                realStats.pagesRead / Math.max(realStats.currentlyReading, 1)
            ), // Average pages per session
            streak: 7, // TODO: Calculate actual streak from reading sessions
            goal: {
                books: 4, // Default goal - could come from settings
                pages: 300, // Default goal
            },
        },
        allTime: {
            totalBooks: realStats.totalBooks,
            totalPages: realStats.totalPages,
            totalTime: Math.round((realStats.totalPages / 25) * 10) / 10, // Estimate
            averageRating: calculateAverageRating(),
            favoriteGenre: calculateFavoriteGenre(),
        },
    };

    // Calculate progress percentages for visual indicators
    const booksProgress = Math.round(
        (stats.currentMonth.booksRead / stats.currentMonth.goal.books) * 100
    );
    const pagesProgress = Math.round(
        (stats.currentMonth.pagesRead / stats.currentMonth.goal.pages) * 100
    );

    // Reading activity data for the chart area (mock data)
    const weeklyActivity = [
        { day: "Mon", pages: 25, time: 45 },
        { day: "Tue", pages: 15, time: 30 },
        { day: "Wed", pages: 0, time: 0 },
        { day: "Thu", pages: 35, time: 60 },
        { day: "Fri", pages: 20, time: 40 },
        { day: "Sat", pages: 40, time: 75 },
        { day: "Sun", pages: 30, time: 50 },
    ];

    return (
        <div
            className="h-100 overflow-auto px-3 py-3"
            style={{
                height: "calc(100vh - 80px)", // Consistent with other pages
                paddingBottom: "20px",
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Reading Stats</h1>
                {/* Time period selector - Bootstrap button group for toggle functionality */}
                <div className="btn-group" role="group">
                    <input
                        type="radio"
                        className="btn-check"
                        name="timePeriod"
                        id="week"
                        value="week"
                        checked={timePeriod === "week"}
                        onChange={(e) => setTimePeriod(e.target.value)}
                    />
                    <label className="btn btn-outline-primary" htmlFor="week">
                        Week
                    </label>

                    <input
                        type="radio"
                        className="btn-check"
                        name="timePeriod"
                        id="month"
                        value="month"
                        checked={timePeriod === "month"}
                        onChange={(e) => setTimePeriod(e.target.value)}
                    />
                    <label className="btn btn-outline-primary" htmlFor="month">
                        Month
                    </label>

                    <input
                        type="radio"
                        className="btn-check"
                        name="timePeriod"
                        id="year"
                        value="year"
                        checked={timePeriod === "year"}
                        onChange={(e) => setTimePeriod(e.target.value)}
                    />
                    <label className="btn btn-outline-primary" htmlFor="year">
                        Year
                    </label>
                </div>
            </div>

            {/* Progress Goals Section - Bootstrap grid for responsive layout */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    {/* Progress card with visual progress bar */}
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="card-title mb-0">
                                    📚 Books Goal
                                </h5>
                                <span className="badge bg-primary">
                                    {booksProgress}%
                                </span>
                            </div>
                            <p className="card-text text-muted">
                                {stats.currentMonth.booksRead} of{" "}
                                {stats.currentMonth.goal.books} books
                            </p>
                            {/* Bootstrap progress bar - provides visual feedback */}
                            <div className="progress" style={{ height: "8px" }}>
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                        width: `${Math.min(
                                            booksProgress,
                                            100
                                        )}%`,
                                    }}
                                    aria-valuenow={booksProgress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="card-title mb-0">
                                    📖 Pages Goal
                                </h5>
                                <span className="badge bg-success">
                                    {pagesProgress}%
                                </span>
                            </div>
                            <p className="card-text text-muted">
                                {stats.currentMonth.pagesRead} of{" "}
                                {stats.currentMonth.goal.pages} pages
                            </p>
                            <div className="progress" style={{ height: "8px" }}>
                                <div
                                    className="progress-bar bg-success"
                                    role="progressbar"
                                    style={{
                                        width: `${Math.min(
                                            pagesProgress,
                                            100
                                        )}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Cards - Using Bootstrap grid for responsive 4-column layout */}
            <div className="row mb-4">
                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <div className="display-6 text-primary">🔥</div>
                            <h3 className="card-title">
                                {stats.currentMonth.streak}
                            </h3>
                            <p className="card-text text-muted">Day Streak</p>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <div className="display-6 text-warning">⏱️</div>
                            <h3 className="card-title">
                                {stats.currentMonth.readingTime}h
                            </h3>
                            <p className="card-text text-muted">Reading Time</p>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <div className="display-6 text-info">📊</div>
                            <h3 className="card-title">
                                {stats.currentMonth.averageSession}m
                            </h3>
                            <p className="card-text text-muted">Avg Session</p>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <div className="display-6 text-success">⭐</div>
                            <h3 className="card-title">
                                {stats.allTime.averageRating}
                            </h3>
                            <p className="card-text text-muted">Avg Rating</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Activity Chart (Mock) - In real app, you'd use Chart.js or similar */}
            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">📈 This Week's Activity</h5>
                </div>
                <div className="card-body">
                    <div className="row text-center">
                        {weeklyActivity.map((day) => (
                            <div key={day.day} className="col">
                                <div className="mb-2">
                                    {/* Simple bar chart using CSS height - shows pages read visually */}
                                    <div
                                        className="bg-primary rounded mx-auto"
                                        style={{
                                            width: "20px",
                                            height: `${Math.max(
                                                day.pages * 2,
                                                5
                                            )}px`, // Minimum 5px height
                                            maxHeight: "80px",
                                        }}
                                    ></div>
                                </div>
                                <small className="text-muted d-block">
                                    {day.day}
                                </small>
                                <small className="fw-bold">{day.pages}p</small>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-3">
                        <small className="text-muted">Pages read per day</small>
                    </div>
                </div>
            </div>

            {/* Recent Achievements Section */}

            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">🏆 Recent Achievements</h5>
                </div>
                <div className="card-body">
                    {/* List group for clean achievement display */}
                    <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Week Warrior</strong>
                                <br />
                                <small className="text-muted">
                                    Read 7 days in a row
                                </small>
                            </div>
                            <span className="badge bg-warning rounded-pill">
                                🔥
                            </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Page Turner</strong>
                                <br />
                                <small className="text-muted">
                                    Read 100 pages in a day
                                </small>
                            </div>
                            <span className="badge bg-info rounded-pill">
                                📚
                            </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Goal Crusher</strong>
                                <br />
                                <small className="text-muted">
                                    Exceeded monthly goal
                                </small>
                            </div>
                            <span className="badge bg-success rounded-pill">
                                🎯
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stats;
