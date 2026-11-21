import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { fetchWeatherByCity } from '../redux/slices/weatherSlice';
import { getWeatherIcon } from '../utils/weatherHelper';
import { decodeHTML } from '../utils/decodeHTML';
import { useEffect } from 'react';

const FALLBACK_IMG = 'https://thanhnien-static.mediacdn.vn/thanhnien.vn/image/logo_tn.png';

const CURRENCIES = [
    { code: 'USD', flag: '🇺🇸', name: 'Đô la Mỹ' },
    { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
    { code: 'JPY', flag: '🇯🇵', name: 'Yên Nhật' },
    { code: 'CNY', flag: '🇨🇳', name: 'Nhân dân tệ' },
];

import { useState } from 'react';

function useExchangeRates() {
    const [rates, setRates]     = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://open.er-api.com/v6/latest/VND')
            .then((r) => r.json())
            .then((data) => {
                if (data.rates) {
                    const vndRates: Record<string, number> = {};
                    for (const code of CURRENCIES.map((c) => c.code)) {
                        if (data.rates[code]) {
                            vndRates[code] = Math.round(1 / data.rates[code]);
                        }
                    }
                    setRates(vndRates);
                }
            })
            .catch(() => { /* Giữ nguyên trạng thái loading khi lỗi */ })
            .finally(() => setLoading(false));
    }, []);

    return { rates, loading };
}

function MostReadWidget() {
    const articles = useAppSelector((s) => s.news.articles);

    const topArticles = articles.slice(0, 8);

    return (
        <div className="sidebar-widget card border-0 shadow-sm mb-4">
            <div className="widget-header">
                <i className="fa-solid fa-fire me-2" />
                TIN ĐỌC NHIỀU
            </div>
            <div className="card-body p-3">
                {topArticles.length === 0 ? (
                    <p className="text-muted text-center small mb-0">Chưa có dữ liệu</p>
                ) : (
                    topArticles.map((article, idx) => (
                        <div key={article.id} className="sidebar-news-item">
                            {/* Số thứ tự */}
                            <span
                                className="flex-shrink-0 fw-bold"
                                style={{
                                    color: idx < 3 ? '#d0021b' : '#999',
                                    fontSize: idx < 3 ? '1.1rem' : '0.9rem',
                                    width: 20,
                                    lineHeight: '1',
                                    paddingTop: 2,
                                }}
                            >
                                {idx + 1}
                            </span>
                            <img
                                src={article.thumbnail}
                                alt={article.title}
                                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                            />
                            <Link
                                to={`/news/${encodeURIComponent(article.id)}`}
                                className="item-title text-decoration-none text-dark"
                            >
                                {decodeHTML(article.title)}
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
function WeatherWidget() {
    const dispatch = useAppDispatch();
    const { selectedCity, temp, condition, isDay, status } =
        useAppSelector((s) => s.weather);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchWeatherByCity('Ho Chi Minh City'));
        }
    }, [dispatch, status]);

    const { icon, color } = getWeatherIcon(condition, isDay);

    return (
        <div className="sidebar-widget card border-0 shadow-sm mb-4">
            <div className="widget-header">
                <i className="fa-solid fa-cloud-sun me-2" />
                THỜI TIẾT
            </div>
            <div className="card-body p-3 text-center">
                {status === 'loading' ? (
                    <div className="spinner-border spinner-border-sm text-danger" role="status" />
                ) : (
                    <>
                        <i className={`fa-solid ${icon} ${color} mb-1`} style={{ fontSize: 42 }} />
                        <div className="fw-bold fs-4 mt-1">
                            {temp !== null ? `${temp}°C` : '--°C'}
                        </div>
                        <div className="text-muted small">{selectedCity || 'TP. Hồ Chí Minh'}</div>
                    </>
                )}
            </div>
        </div>
    );
}

function ExchangeWidget() {
    const { rates, loading } = useExchangeRates();

    return (
        <div className="sidebar-widget card border-0 shadow-sm mb-4">
            <div className="widget-header">
                <i className="fa-solid fa-dollar-sign me-2" />
                TỶ GIÁ NGOẠI TỆ
            </div>
            <div className="card-body p-3">
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border spinner-border-sm text-danger" role="status" />
                    </div>
                ) : (
                    <table className="table table-sm table-borderless mb-0" style={{ fontSize: '0.82rem' }}>
                        <thead>
                        <tr className="text-muted">
                            <th>Ngoại tệ</th>
                            <th className="text-end">VND</th>
                        </tr>
                        </thead>
                        <tbody>
                        {CURRENCIES.map(({ code, flag, name }) => (
                            <tr key={code}>
                                <td>
                                    <span className="me-1">{flag}</span>
                                    <span className="fw-semibold">{code}</span>
                                    <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                                        {name}
                                    </small>
                                </td>
                                <td className="text-end fw-semibold text-danger">
                                    {rates[code]
                                        ? rates[code].toLocaleString('vi-VN')
                                        : '---'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                <div className="text-muted text-end" style={{ fontSize: '0.68rem', marginTop: 4 }}>
                    Nguồn: open.er-api.com
                </div>
            </div>
        </div>
    );
}

export default function Sidebar() {
    return (
        <aside>
            <WeatherWidget />
            <MostReadWidget />
            <ExchangeWidget />
        </aside>
    );
}

