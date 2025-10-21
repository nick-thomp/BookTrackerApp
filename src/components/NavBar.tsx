import { useState } from "react";

interface Props {
    navBarItems: string[];
    onSelectedPage: (item: string) => void;
}

function NavBar({ navBarItems, onSelectedPage }: Props) {
    const [selectedPage, setSelectedPage] = useState("Home");

    // Map navigation items to their corresponding icons
    const navIcons: Record<string, string> = {
        Home: "bi-house-fill",
        Library: "bi-book-fill",
        Notes: "bi-journal-text",
        Stats: "bi-graph-up",
    };

    return (
        <ul className="nav nav-pills nav-fill navbar fixed-bottom bg-body-tertiary p-3 border-top">
            {navBarItems.map((item, index) => (
                <li className="nav-item" key={index}>
                    <a
                        className={
                            selectedPage === item
                                ? "nav-link active d-flex flex-column align-items-center py-2"
                                : "nav-link d-flex flex-column align-items-center py-2 text-muted"
                        }
                        aria-current="page"
                        href="#"
                        onClick={() => {
                            setSelectedPage(item);
                            onSelectedPage(item);
                        }}
                        style={{ textDecoration: "none" }}
                    >
                        <i className={`${navIcons[item]} fs-5 mb-1`}></i>
                        <span className="small">{item}</span>
                    </a>
                </li>
            ))}
        </ul>
    );
}

export default NavBar;
