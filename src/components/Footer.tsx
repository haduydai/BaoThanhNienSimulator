import { Link } from 'react-router-dom';
import { CATEGORY_LABELS } from '../services/rssService';

const QUICK_LINKS = ['thoi-su', 'the-gioi', 'kinh-te', 'doi-song', 'giai-tri', 'the-thao'];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer-tn mt-5 pt-5 pb-3">
            <div className="container">
                <div className="row g-4 mb-4">

                    <div className="col-12 col-md-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <div
                                className="d-flex align-items-center justify-content-center bg-danger rounded"
                                style={{ width: 40, height: 40 }}
                            >
                                <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>TN</span>
                            </div>
                            <div className="footer-brand">BÁO THANH NIÊN</div>
                        </div>
                        <p className="mb-3" style={{ lineHeight: '1.7' }}>
                            Báo Thanh Niên là cơ quan ngôn luận của Hội LHTN Việt Nam,
                            cung cấp thông tin nhanh, chính xác và đáng tin cậy về các
                            lĩnh vực chính trị, kinh tế, xã hội, văn hoá và thể thao.
                        </p>
                        <div className="d-flex gap-3 fs-5">
                            <a href="https://www.facebook.com/thanhnien" target="_blank" rel="noreferrer"
                               className="text-primary" title="Facebook">
                                <i className="fa-brands fa-facebook" />
                            </a>
                            <a href="https://www.youtube.com/channel/UCIW9cGgoRuGJnky3K3tbzNg"
                               target="_blank" rel="noreferrer" className="text-danger" title="YouTube">
                                <i className="fa-brands fa-youtube" />
                            </a>
                            <a href="https://www.tiktok.com/baothanhnien.official"
                               target="_blank" rel="noreferrer" className="text-light" title="TikTok">
                                <i className="fa-brands fa-tiktok" />
                            </a>
                            <a href="https://zalo.me/2431025964363015388"
                               target="_blank" rel="noreferrer" title="Zalo">
                                <img
                                    src="https://thanhnien-static.mediacdn.vn/thanhnien.vn/image/icon_zalo_full_color.svg"
                                    width="20" height="20" alt="Zalo"
                                />
                            </a>
                        </div>
                    </div>

                    <div className="col-6 col-md-2">
                        <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                            Chuyên mục
                        </h6>
                        <ul className="list-unstyled mb-0">
                            {QUICK_LINKS.map((slug) => (
                                <li key={slug} className="mb-2">
                                    <Link to={`/category/${slug}`} className="footer-link">
                                        <i className="fa-solid fa-angle-right me-1 text-danger" style={{ fontSize: '0.7rem' }} />
                                        {CATEGORY_LABELS[slug]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-6 col-md-2">
                        <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                            Tiện ích
                        </h6>
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                                <Link to="/bookmarks" className="footer-link">
                                    <i className="fa-solid fa-bookmark me-1 text-danger" />
                                    Tin đã lưu
                                </Link>
                            </li>
                            <li className="mb-2">
                                <a href="https://thanhnien.vn" target="_blank" rel="noreferrer" className="footer-link">
                                    <i className="fa-solid fa-newspaper me-1 text-danger" />
                                    Website gốc
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="https://thanhnien.vn/rss/home.rss" target="_blank" rel="noreferrer" className="footer-link">
                                    <i className="fa-solid fa-rss me-1 text-danger" />
                                    RSS Feed
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-12 col-md-4">
                        <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                            Liên hệ tòa soạn
                        </h6>
                        <ul className="list-unstyled mb-0" style={{ lineHeight: '2' }}>
                            <li>
                                <i className="fa-solid fa-location-dot text-danger me-2" />
                                268 Bis Lý Thường Kiệt, P.14, Q.10, TP.HCM
                            </li>
                            <li>
                                <i className="fa-solid fa-phone text-danger me-2" />
                                (028) 3868 5566
                            </li>
                            <li>
                                <i className="fa-solid fa-envelope text-danger me-2" />
                                <a href="mailto:toasoan@thanhnien.vn" className="footer-link">
                                    toasoan@thanhnien.vn
                                </a>
                            </li>
                            <li>
                                <i className="fa-solid fa-globe text-danger me-2" />
                                <a href="https://thanhnien.vn" target="_blank" rel="noreferrer" className="footer-link">
                                    thanhnien.vn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-center">
                    <small>
                        © {year} Giấy phép xuất bản số 110/GP - BTTTT cấp ngày 24.3.2020 © 2003-2026 Bản quyền thuộc về Báo Thanh Niên.
                    </small>
                    <small>
                        Ứng dụng mô phỏng – Dự án học thuật ReactJS
                        <span className="text-danger ms-1">♥</span>
                    </small>
                </div>
            </div>
        </footer>
    );
}

