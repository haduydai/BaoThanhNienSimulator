
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchHomeNews } from '../redux/slices/newsSlice';
import NewsCard from '../components/NewsCard';

// tải cho trang chủ
const HOME_SLUGS = ['trang-chu', 'thoi-su', 'the-gioi', 'kinh-te', 'doi-song', 'giai-tri', 'the-thao'];
const PAGE_SIZE  = 12;   // số bài mỗi lần hiển thị

export default function Home() {
    const dispatch = useAppDispatch();
    const { articles, isLoading, isError, errorMessage } =
        useAppSelector((s) => s.news);

    const [searchParams] = useSearchParams();
    const query          = searchParams.get('q')?.trim().toLowerCase() ?? '';
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Tải dữ liệu khi mount
    useEffect(() => {
        dispatch(fetchHomeNews(HOME_SLUGS));
    }, [dispatch]);

    //reset phân trang khi query đổi
    useEffect(() => { setVisibleCount(PAGE_SIZE); }, [query]);

    // lọc theo từ khoá tìm kiếm( client)
    const filtered = useMemo(() => {
        if (!query) return articles;
        return articles.filter(
            (a) =>
                a.title.toLowerCase().includes(query) ||
                a.description.toLowerCase().includes(query)
        );
    }, [articles, query]);

    const displayed = filtered.slice(0, visibleCount);
    const hasMore   = visibleCount < filtered.length;
    //loading
    if (isLoading && articles.length === 0) {
        return (
            <div className="loading-overlay">
                <div className="spinner-border text-danger" style={{ width: 48, height: 48 }} role="status" />
                <p className="text-muted fw-semibold">Đang tải tin tức...</p>
            </div>
        );
    }

    //error
    if (isError && articles.length === 0) {
        return (
            <div className="alert alert-danger d-flex align-items-center gap-3">
                <i className="fa-solid fa-triangle-exclamation fs-4" />
                <div>
                    <strong>Không thể tải dữ liệu.</strong>
                    <p className="mb-1 mt-1 small">{errorMessage}</p>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => dispatch(fetchHomeNews(HOME_SLUGS))}
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
            {/* Tiêu đề section */}
            {query ? (
                <div className="mb-4">
                    <div className="section-header">
                        Kết quả tìm kiếm: &ldquo;{searchParams.get('q')}&rdquo;
                    </div>
                    <p className="text-muted small">
                        Tìm thấy <strong>{filtered.length}</strong> bài viết phù hợp
                    </p>
                </div>
            ) : (
                <div className="section-header mb-4">
                    <i className="fa-solid fa-bolt me-2" />
                    Tin mới nhất
                </div>
            )}

            {/* refetch) */}
            {isLoading && articles.length > 0 && (
                <div className="text-center mb-3">
                    <div className="spinner-border spinner-border-sm text-danger me-2" role="status" />
                    <small className="text-muted">Đang cập nhật...</small>
                </div>
            )}

            {/* Grid bài viết */}
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
                                Xem thêm ({filtered.length - visibleCount} bài còn lại)
                            </button>
                        </div>
                    )}
                </>
            ) : (
                !isLoading && (
                    <div className="text-center py-5 text-muted">
                        <i className="fa-regular fa-folder-open fa-3x mb-3 d-block" />
                        {query
                            ? 'Không tìm thấy bài viết phù hợp với từ khoá này.'
                            : 'Chưa có bài viết nào.'}
                    </div>
                )
            )}
        </>
    );
}