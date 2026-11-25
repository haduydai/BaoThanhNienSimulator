
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import NavbarMenu from "./NavbarMenu";

export default function NavBar() {
    const { categories } = useSelector(
        (state: RootState) => state.categories
    );

    const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

    const activeCategory = categories.find(
        (category) => category.id === hoveredCategory
    );

    return (
        <nav className="bg-white border-bottom border-2 border-primary">
            <div
                className="container position-relative"
                onMouseLeave={() => setHoveredCategory(null)}
            >
                <div className="d-flex align-items-center gap-3 overflow-auto flex-nowrap px-4">
                    <NavLink
                        to="/"
                        end
                        onMouseEnter={() => setHoveredCategory(null)}
                        className="text-primary fs-5 py-2 flex-shrink-0"
                    >
                        <i className="fa-solid fa-house"></i>
                    </NavLink>

                    {categories.map((category) => (
                        <NavLink
                            key={category.id}
                            to={category.link}
                            onMouseEnter={() => setHoveredCategory(category.id)}
                            className={({ isActive }) =>
                                `text-decoration-none fw-semibold small py-3 flex-shrink-0 ${
                                    isActive || hoveredCategory === category.id
                                        ? "text-primary border-bottom border-2 border-primary"
                                        : "text-dark"
                                }`
                            }
                        >
                            {category.name}
                        </NavLink>
                    ))}

                </div>

                {activeCategory && (
                    <div className="position-absolute top-100 start-0 w-100 z-3">
                        <NavbarMenu category={activeCategory} />
                    </div>
                )}

            </div>
        </nav>
    );
}
