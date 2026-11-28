import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { removeBookmark, clearAllBookmarks } from '../redux/slices/bookmarkSlice';
import NewsCard from '../components/NewsCard';

export default function Bookmark() {
    const dispatch  = useAppDispatch();
    const bookmarks = useAppSelector((s) => s.bookmark.bookmarks);

    // Empty state
    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-5">
                <i
                    className="fa-regular fa-bookmark text-muted d-block mb-3"
                    style={{ fontSize: 72 }}
                />
                <h4 className="fw-bold mb-2">Chưa có bài viết nào được lưu</h4>
                <p className="text-muted mb-4">
                    Nhấn vào biểu tượng{' '}
                    <i className="fa-regular fa-bookmark text-danger" />{' '}
                    trên mỗi bài viết để lưu lại đọc sau.
                </p>
                <Link to="/" className="btn btn-danger px-4">
                    <i className="fa-solid fa-newspaper me-2" />
                    Khám phá tin tức
                </Link>
            </div>
        );
    }

    // Có bài đã lưu
    return (
        <>
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div className="section-header mb-0">
                    <i className="fa-solid fa-bookmark me-2" />
                    Tin đã lưu
                    <span className="badge bg-danger ms-2 fs-6">{bookmarks.length}</span>
                </div>
                <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                        if (window.confirm(`Xoá tất cả ${bookmarks.length} bài đã lưu?`)) {
                            dispatch(clearAllBookmarks());
                        }
                    }}
                >
                    <i className="fa-solid fa-trash me-1" />
                    Xoá tất cả
                </button>
            </div>

            {/* Grid bài đã lưu */}
            <div className="row g-3">
                {bookmarks.map((article) => (
                    <div key={article.id} className="col-12 col-sm-6 col-lg-4">
                        {/* Wrapper để thêm nút xoá nổi trên NewsCard */}
                        <div className="position-relative">
                            <NewsCard article={article} />
                            <button
                                className="btn btn-sm btn-danger position-absolute"
                                style={{ top: 8, right: 8, zIndex: 10, lineHeight: 1 }}
                                title="Xoá khỏi danh sách đã lưu"
                                onClick={() => dispatch(removeBookmark(article.id))}
                            >
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}