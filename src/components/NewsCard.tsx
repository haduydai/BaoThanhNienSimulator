
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { addBookmark, removeBookmark, selectIsBookmarked } from '../redux/slices/bookmarkSlice';
import type { NewsArticle } from '../services/rssService';
import { CATEGORY_LABELS } from '../services/rssService';
import { decodeHTML } from '../utils/decodeHTML';



interface NewsCardProps {
    article: NewsArticle;
    compact?: boolean;   // layout ngang nhỏ gọn
}

// Fallback ảnh khi src lỗi
const FALLBACK_IMG = 'https://thanhnien-static.mediacdn.vn/thanhnien.vn/image/logo_tn.png';

function formatDate(isoDate: string): string {
    try {
        return new Date(isoDate).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return isoDate;
    }
}
// ── Full card variant ──────────────────────────────────────
export default function NewsCard({ article, compact = false }: NewsCardProps) {
    const dispatch = useAppDispatch();
    const isSaved  = useAppSelector(selectIsBookmarked(article.id));

    if (compact) return <CompactCard article={article} />;

    const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;
    const cleanTitle    = decodeHTML(article.title);
    const cleanDesc     = decodeHTML(article.description);

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSaved) {
            dispatch(removeBookmark(article.id));
        } else {
            dispatch(addBookmark(article));
        }
    };

    return (
        <div className="card news-card h-100 shadow-sm">
            {/* Thumbnail */}
            <div className="position-relative overflow-hidden">
                <img
                    src={article.thumbnail}
                    className="card-img-top"
                    alt={cleanTitle}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                />
                {/* Badge chuyên mục nổi trên ảnh */}
                <span
                    className="position-absolute bottom-0 start-0 badge bg-danger m-2"
                    style={{ fontSize: '0.72rem' }}
                >
                    {categoryLabel}
                </span>
            </div>

            <div className="card-body d-flex flex-column p-3">
                {/* Tiêu đề */}
                <h6 className="card-title fw-bold mb-2" style={{ lineHeight: '1.45' }}>
                    <Link
                        to={`/news/${encodeURIComponent(article.id)}`}
                        className="text-decoration-none text-dark stretched-link"
                    >
                        {cleanTitle}
                    </Link>
                </h6>

                {/* Mô tả */}
                {cleanDesc && (
                    <p className="news-description text-muted mb-2">
                        {cleanDesc}
                    </p>
                )}

                {/* Footer card: thời gian + nút bookmark */}
                <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                    <small className="text-muted">
                        <i className="fa-regular fa-clock me-1" />
                        {formatDate(article.pubDate)}
                    </small>

                    <button
                        className={`btn btn-sm p-1 border-0 ${isSaved ? 'text-danger' : 'text-secondary'}`}
                        onClick={handleBookmark}
                        title={isSaved ? 'Bỏ lưu' : 'Lưu để đọc sau'}
                        style={{ position: 'relative', zIndex: 2 }}  /* nổi trên stretched-link */
                    >
                        <i className={`fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`} />
                    </button>
                </div>
            </div>
        </div>
    );
}