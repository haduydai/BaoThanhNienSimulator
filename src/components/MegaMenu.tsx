
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
    const { categories, utilities, quickLinks} = useSelector(
        (state: RootState) => state.categories
    );
    const {socialLinks} = useSelector(
        (state:RootState) => state.socials
    );
    if (!isOpen) return null;

    return (
        <div className="p-3 bg-white">

            <div className="d-flex text-start mb-3">
                <button
                    onClick={onClose}
                    className="btn text-dark"
                >
                    <i className="fa-solid fa-xmark me-2"></i>
                    Đóng menu
                </button>
            </div>

            <div className="row">

                <div className="col-lg-9">
                    <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-4">

                        {categories.map((category) => (
                            <div className="col" key={category.id}>
                                <div>
                                    <h6 className="mb-3">
                                        <a
                                            href={category.link || "#"}
                                            className="text-dark fw-bold text-decoration-none"
                                        >
                                            {category.name}
                                        </a>
                                    </h6>

                                    <ul className="list-unstyled mb-0">
                                        {category.items.map((item, index) => (
                                            <li key={`${category.id}-${index}`} className="mb-2">
                                                <a
                                                    href={item.link}
                                                    className="text-secondary text-decoration-none small"
                                                >
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                <div className="col-lg-3 border-start ps-lg-3 mt-4 mt-lg-0">

                    <div className="d-flex flex-column gap-2 pb-3 border-bottom">
                        {utilities.map((item) => (
                            <a
                                href={item.link}
                                key={item.id}
                                className="d-flex align-items-center border text-dark text-decoration-none"
                            >
                                <span className="d-flex justify-content-center align-items-center border-end text-primary"
                                      style={{ width: "40px", height: "40px" }}
                                >
                                    <i className={`fa-solid ${item.icon}`}></i>
                                </span>

                                <span className="small fw-semibold ms-2">
                                    {item.name}
                                </span>
                            </a>
                        ))}
                    </div>

                    <div className="d-flex flex-column gap-3 py-3 border-bottom">
                        {quickLinks.map((item) => (
                            <a
                                href={item.link}
                                key={item.id}
                                className="d-flex align-items-center gap-2 text-secondary text-decoration-none small"
                            >
                                <i className={`fa-solid ${item.icon}`}></i>
                                {item.name}
                            </a>
                        ))}
                    </div>

                    <div className="d-flex gap-3 pt-3">
                        {socialLinks.map((item) => (
                            <a
                                key={item.id}
                                href={item.link}
                                target="_blank"
                                rel="noreferrer"
                                className="border rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "42px", height: "42px" }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    width="24"
                                    height="24"
                                />
                            </a>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
