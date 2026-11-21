import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchNewsByCategory } from '../redux/slices/newsSlice';
import { CATEGORY_LABELS, RSS_FEEDS } from '../services/rssService';
import NewsCard from '../components/NewsCard';

const PAGE_SIZE = 12;

export default function Category() {
    const { slug = '' }  = useParams<{ slug: string }>();
    const dispatch        = useAppDispatch();
    const { articles, isLoading, isError, errorMessage } =
        useAppSelector((s) => s.news);

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Khi slug thay đổi: fetch mới → reset phân trang
    useEffect(() => {
        if (!RSS_FEEDS[slug]) return;
        setVisibleCount(PAGE_SIZE);
        dispatch(fetchNewsByCategory(slug));
    }, [dispatch, slug]);

    const categoryLabel = CATEGORY_LABELS[slug] ?? 'Chuyên mục';
    const displayed     = articles.slice(0, visibleCount);
    const hasMore       = visibleCount < articles.length;
    // Slug không tồn tại
    if (slug && !RSS_FEEDS[slug]) {
        return (
            <div className="text-center py-5">
                <i className="fa-solid fa-circle-xmark text-danger fa-3x mb-3 d-block" />
                <h5>Chuyên mục &ldquo;{slug}&rdquo; không tồn tại</h5>
                <Link to="/" className="btn btn-danger mt-2">Về trang chủ</Link>
            </div>
        );
    }

    // Loading
    if (isLoading && articles.length === 0) {
        return (
            <div className="loading-overlay">
                <div className="spinner-border text-danger" style={{ width: 48, height: 48 }} role="status" />
                <p className="text-muted fw-semibold">Đang tải {categoryLabel}...</p>
            </div>
        );
    }

    // Error
    if (isError && articles.length === 0) {
        return (
            <div className="alert alert-danger d-flex align-items-center gap-3">
                <i className="fa-solid fa-triangle-exclamation fs-4" />
                <div>
                    <strong>Không thể tải dữ liệu.</strong>
                    <p className="mb-1 mt-1 small">{errorMessage}</p>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => dispatch(fetchNewsByCategory(slug))}
                    >
                        <i className="fa-solid fa-rotate-right me-1" />
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }
    return (
        <>
            {/* Section header */}
            <div className="section-header mb-4">
                <i className="fa-solid fa-layer-group me-2" />
                {categoryLabel}
            </div>

            {/* Đang tải lại */}
            {isLoading && articles.length > 0 && (
                <div className="text-center mb-3">
                    <div className="spinner-border spinner-border-sm text-danger me-2" role="status" />
                    <small className="text-muted">Đang cập nhật...</small>
                </div>
            )}

            {/* Grid */}
            {displayed.length > 0 ? (
                <>
                    <div className="row g-3">
                        {displayed.map((article) => (
                            <div key={article.id} className="col-12 col-sm-6 col-xl-4">
                                <NewsCard article={article} />
                            </div>
                        ))}
                    </div>

                    {/* Load more */}
                    {hasMore && (
                        <div className="text-center mt-4">
                            <button
                                className="btn btn-outline-danger px-5"
                                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                            >
                                <i className="fa-solid fa-plus me-2" />
                                Xem thêm ({articles.length - visibleCount} bài còn lại)
                            </button>
                        </div>
                    )}
                </>
            ) : (
                !isLoading && (
                    <div className="text-center py-5 text-muted">
                        <i className="fa-regular fa-folder-open fa-3x mb-3 d-block" />
                        Chưa có bài viết nào trong chuyên mục này.
                    </div>
                )
            )}
        </>
    );
}
