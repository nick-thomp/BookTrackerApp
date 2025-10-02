import { useState } from "react";

interface Props {
    navBarItems: string[];
    onSelectedPage: (item: string) => void;
}

function NavBar({ navBarItems, onSelectedPage }: Props) {
    const [selectedPage, setSelectedPage] = useState("Home");

    return (
        <ul className="nav nav-pills nav-fill navbar fixed-bottom bg-body-tertiary p-3">
            {navBarItems.map((item, index) => (
                <li className="nav-item" key={index}>
                    <a
                        className={
                            selectedPage === item
                                ? "nav-link active"
                                : "nav-link"
                        }
                        aria-current="page"
                        href="#"
                        onClick={() => {
                            setSelectedPage(item);
                            onSelectedPage(item);
                        }}
                    >
                        {item}
                    </a>
                </li>
            ))}
        </ul>
    );
}

export default NavBar;
