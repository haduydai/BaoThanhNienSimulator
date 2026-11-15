import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { fetchWeatherByCity } from '../redux/weatherSlice';
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
