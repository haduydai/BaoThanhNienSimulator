
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchNavbarMenuNews } from "../redux/slices/newsSlice";

interface NavbarMenuProps {
    category: {
        id: number;
        name: string;
        link: string;
        items: {
            name: string;
            link: string;
        }[];
    };
}

export default function NavbarMenu({ category }: NavbarMenuProps) {
    const dispatch = useAppDispatch();

    const categorySlug = category.link.replace(/^\/|\/$/g, "");

    const { articles, isLoading, error } = useAppSelector((state) => ({
        articles: state.news.menuArticles[categorySlug] ?? [],
        isLoading: state.news.menuLoading.includes(categorySlug),
        error: state.news.menuErrors[categorySlug],
    }));

    useEffect(() => {
        dispatch(fetchNavbarMenuNews(categorySlug));
    }, [dispatch, categorySlug]);

    return (
        <div className="bg-white shadow p-3">
            <div className="row">

                <div className="col-lg-4 border-end ">
                    <h6 className="text-dark mb-3">{category.name}</h6>

                    <div className="row row-cols-2 g-1">
                        {category.items.map((item, index) => (
                            <div className="col" key={index}>
                                <NavLink
                                    to={item.link}
                                    className="text-dark text-decoration-none small"
                                >
                                    {item.name}
                                </NavLink>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-dark col-lg-8">
                    {isLoading && articles.length === 0 && (
                        <p className="mb-0">
                            Đang tải tin tức...
                        </p>
                    )}

                    {error && articles.length === 0 && (
                        <p className="mb-0">{error}</p>
                    )}

                    {!isLoading && !error && articles.length === 0 && (
                        <p className="mb-0">
                            Không có bài viết
                        </p>
                    )}

                    <div className="row g-3">
                        {articles.slice(0, 3).map((article) => (
                            <div className="col-4" key={article.id}>
                                <div>
                                    <a
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-decoration-none"
                                    >
                                        <img
                                            src={article.thumbnail}
                                            alt={article.title}
                                            className="img-fluid w-100 rounded"
                                        />

                                        <p className="text-dark small mt-2 mb-0">
                                            {article.title}
                                        </p>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
