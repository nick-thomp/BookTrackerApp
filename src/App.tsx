import { useState } from "react";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Library from "./components/Library";
import Notes from "./components/Notes";
import Stats from "./components/Stats";
import { BookTrackerProvider } from "./contexts/BookTrackerContext";

function App() {
    const [selectedPage, setSelectedPage] = useState("Home");
    const handleSelectedPage = (pageName: string) => {
        setSelectedPage(pageName);
    };

    // Object mapping page names to components
    const pageComponents: Record<string, React.ReactNode> = {
        Home: <Home />,
        Library: <Library />,
        Notes: <Notes />,
        Stats: <Stats />,
    };

    return (
        <BookTrackerProvider>
            <div className="pb-5 mb-3">
                {pageComponents[selectedPage] || <Home />}
            </div>
            <NavBar
                // Stats removed for now
                navBarItems={["Home", "Library", "Notes"]}
                onSelectedPage={handleSelectedPage}
            />
        </BookTrackerProvider>
    );
}

export default App;
