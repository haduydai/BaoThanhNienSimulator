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


}