
import {useState, useRef, useEffect} from 'react';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {toggleTheme} from '../redux/slices/themeSlice';
import {CATEGORY_LABELS} from '../services/rssService';

//chuyên mục hiển thị trên Navbar (giới hạn )
const NAV_CATEGORIES = [
    'thoi-su', 'the-gioi', 'kinh-te', 'doi-song',
    'giai-tri', 'the-thao', 'giao-duc', 'cong-nghe',
];

export default function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const themeMode = useAppSelector((s) => s.theme.mode);
    const bookmarks = useAppSelector((s) => s.bookmark.bookmarks);

    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);


    // khi click ra ngoài->Đóng menu
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.navbar')) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (!q) return;
        // Điều hướng về trang chủ(sài query string)
        navigate(`/?q=${encodeURIComponent(q)}`);
        setSearchQuery('');
        setMenuOpen(false);
    };

    const isDark = themeMode === 'dark';

    return (
        <header className="header-main sticky-top shadow-sm">
            {/* -dải đỏ logo + tìm kiếm + actions -*/}
            <div className="navbar-tn py-2">
                <div className="container d-flex align-items-center gap-3">

                    {/* Logo + Brand */}
                    <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 flex-shrink-0">
                        <div
                            className="d-flex align-items-center justify-content-center bg-white rounded"
                            style={{width: 36, height: 36}}
                        >
                            <span style={{color: '#d0021b', fontWeight: 900, fontSize: 18, lineHeight: 1}}>TN</span>
                        </div>
                        <div className="text-white lh-1">
                            <div style={{fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.5px'}}>
                                THANH NIÊN
                            </div>
                            <div style={{fontSize: '0.65rem', opacity: 0.85, letterSpacing: '1px'}}>
                                THÔNG TIN NHANH · CHÍNH XÁC
                            </div>
                        </div>
                    </Link>

                    {/*actions phải */}
                    <div className="d-flex align-items-center gap-2 ms-auto flex-shrink-0">

                        {/*nút Dark/Light mode */}
                        <button
                            className="btn btn-sm btn-light d-flex align-items-center gap-1 px-2"
                            onClick={() => dispatch(toggleTheme())}
                            title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
                        >
                            <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}/>
                            <span className="d-none d-lg-inline" style={{fontSize: '0.8rem'}}>
                                {isDark ? 'Sáng' : 'Tối'}
                            </span>
                        </button>

                        {/* nút Bookmark */}
                        <Link
                            to="/bookmarks"
                            className="btn btn-sm btn-light position-relative d-flex align-items-center gap-1 px-2"
                            title="Tin đã lưu"
                        >
                            <i className="fa-solid fa-bookmark"/>
                            <span className="d-none d-lg-inline" style={{fontSize: '0.8rem'}}>Đã lưu</span>
                            {bookmarks.length > 0 && (
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                                    style={{fontSize: '0.65rem'}}
                                >
                                    {bookmarks.length}
                                </span>
                            )}
                        </Link>

                        <button
                            className="navbar-toggler btn btn-sm btn-light d-md-none"
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menu"
                        >
                            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* -Menu chuyên mục - */}
            <nav
                className="border-bottom"
                style={{
                    backgroundColor: isDark ? '#1a1a2e' : '#fff',
                    borderColor: 'rgba(0,0,0,0.08) !important',
                }}
            >
                {/* Desktop: thanh ngang */}
                <div className="container d-none d-md-flex category-nav">
                    <NavLink
                        to="/"
                        end
                        className={({isActive}) =>
                            `nav-link fw-semibold ${isActive ? 'active text-danger' : ''}`
                        }
                    >
                        Trang chủ
                    </NavLink>
                    {NAV_CATEGORIES.map((slug) => (
                        <NavLink
                            key={slug}
                            to={`/category/${slug}`}
                            className={({isActive}) =>
                                `nav-link fw-semibold ${isActive ? 'active text-danger' : ''}`
                            }
                        >
                            {CATEGORY_LABELS[slug]}
                        </NavLink>
                    ))}
                </div>
                <div className="d-flex flex-wrap gap-1">
                    <NavLink
                        to="/"
                        end
                        onClick={() => setMenuOpen(false)}
                        className={({isActive}) =>
                            `btn btn-sm ${isActive ? 'btn-danger' : 'btn-outline-secondary'}`
                        }
                    >
                        Trang chủ
                    </NavLink>
                    {NAV_CATEGORIES.map((slug) => (
                        <NavLink
                            key={slug}
                            to={`/category/${slug}`}
                            onClick={() => setMenuOpen(false)}
                            className={({isActive}) =>
                                `btn btn-sm ${isActive ? 'btn-danger' : 'btn-outline-secondary'}`
                            }
                        >
                            {CATEGORY_LABELS[slug]}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </header>
    );
}