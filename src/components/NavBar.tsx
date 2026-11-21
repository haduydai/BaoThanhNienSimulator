
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export default function NavBar() {
    const { categories } = useSelector(
        (state: RootState) => state.categories
    );

    return (
        <nav className="bg-white border-bottom border-2 border-primary">
            <div className="container">
                <div className="d-flex align-items-center gap-3 overflow-auto flex-nowrap px-4">

                    <NavLink
                        to="/"
                        className="text-primary fs-5 py-2 flex-shrink-0"
                    >
                        <i className="fa-solid fa-house"></i>
                    </NavLink>

                    {categories.map((category) => (
                        <NavLink
                            key={category.id}
                            to={category.link}
                            className={({ isActive }) =>
                                `text-decoration-none fw-semibold small py-3 flex-shrink-0 ${
                                    isActive
                                        ? "text-primary border-bottom border-2 border-primary"
                                        : "text-dark"
                                }`
                            }
                        >
                            {category.name}
                        </NavLink>
                    ))}

                </div>
            </div>
        </nav>
    );
}
