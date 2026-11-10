import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeatherByCity } from '../redux/slices/weatherSlice.ts';
import type { AppDispatch, RootState } from "../redux/store";
import { getWeatherIcon } from "../utils/weatherHelper.ts";

const POPULAR_CITIES = [
    { id: 'hcm', displayName: 'TP. Hồ Chí Minh', searchName: 'Ho Chi Minh City', country: 'Việt Nam' },
    { id: 'hn', displayName: 'Hà Nội', searchName: 'Hanoi', country: 'Việt Nam' },
    { id: 'dn', displayName: 'Đà Nẵng', searchName: 'Da Nang', country: 'Việt Nam' },
    { id: 'hp', displayName: 'Hải Phòng', searchName: 'Haiphong', country: 'Việt Nam' },
    { id: 'ct', displayName: 'Cần Thơ', searchName: 'Can Tho', country: 'Việt Nam' },
];
export default function TopHeader() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        selectedCity,
        temp,
        condition,
        isDay,
        status,
        error
    } = useSelector((state: RootState) => state.weather);

    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cities, setCities] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        dispatch(fetchWeatherByCity('Ho Chi Minh City'));
    }, [dispatch]);

    const handleSearchCity = async (keyword: string) => {
        setSearchQuery(keyword);
        if (!keyword.trim()) {
            setCities([]);
            return;
        }

        try {
            setIsSearching(true);
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(keyword)}&count=10&language=vi&format=json`
            );
            if (!response.ok) throw new Error('Không thể tìm kiếm thành phố');

            const data = await response.json();
            const vietnamCities = (data.results || []).filter(
                (city: any) => city.country_code === 'VN'
            );
            setCities(vietnamCities);
        } catch (err) {
            console.error(err);
            setCities([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectCity = (cityName: string) => {
        dispatch(fetchWeatherByCity(cityName));
        setIsOpenDropdown(false);
        setSearchQuery('');
        setCities([]);
    };

    const formattedDate = currentDate.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });

    const weatherIcon = getWeatherIcon(condition, isDay);

    return (
        <div
            className="bg-light text-secondary py-2 border-bottom"
            style={{ fontSize: '14px' }}
        >
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3 text-nowrap">
                    <span className="text-dark">
                        {formattedDate}
                    </span>
                    <span className="text-muted">|</span>
                    <div className="position-relative">
                        <div
                            className="d-flex align-items-center gap-2 text-dark"
                            onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>
                                {selectedCity || 'Đang tải...'}
                            </span>

                            <i
                                className="fa-solid fa-chevron-down"
                                style={{ fontSize: '11px',
                                    transition: 'transform 0.2s ease',
                                    transform: isOpenDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}}
                            ></i>

                            <span className="fw-bold">
                                {temp !== null ? `${temp}°C` : '--°C'}
                            </span>

                            <i
                                className={`fa-solid ${weatherIcon.icon} ${weatherIcon.color}`}
                                style={{ fontSize: '20px' }}
                            ></i>

                        </div>

                        {isOpenDropdown && (
                            <div
                                className="position-absolute top-100 start-0 bg-white border border-light-subtle rounded shadow-sm p-2 mt-2 z-3"
                                style={{ width: '250px' }}
                            >
                                <div className="input-group input-group-sm mb-2">
                                    <input
                                        type="text"
                                        className="form-control bg-light border-light-subtle text-dark"
                                        placeholder="Nhập tên tỉnh, thành phố..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearchCity(e.target.value)}
                                    />
                                    <span className="input-group-text bg-light border-light-subtle text-dark">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </span>
                                </div>
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {isSearching && (
                                        <div className="text-center py-2">
                                            Đang tìm kiếm...
                                        </div>
                                    )}
                                    {!isSearching && !searchQuery && (
                                        <>
                                            <div className="px-2 py-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                                Thành phố phổ biến
                                            </div>
                                            {POPULAR_CITIES.map((city) => (
                                                <div
                                                    key={city.id}
                                                    onClick={() => handleSelectCity(city.searchName)}
                                                    className="text-dark py-2 px-2 rounded hover-bg"
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div>{city.displayName}</div>
                                                    <small>{city.country}</small>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                    {!isSearching && searchQuery && cities.map((city: any) => (
                                        <div
                                            key={city.id}
                                            onClick={() => handleSelectCity(city.name)}
                                            className="text-dark py-2 px-2 rounded"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div>{city.name}</div>
                                            <small>
                                                {[city.admin1, city.country].filter(Boolean).join(', ')}
                                            </small>
                                        </div>
                                    ))}
                                    {!isSearching && searchQuery && cities.length === 0 && (
                                        <div className="text-center py-2">
                                            Không tìm thấy thành phố
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <span className="text-muted">|</span>
                    <a href="#" className="text-secondary text-decoration-none">Bạn cần biết</a>
                    <span className="text-muted">|</span>
                    <a href="#" className="text-secondary text-decoration-none">Tiện ích</a>
                    <span className="text-muted">|</span>
                    <a href="#" className="text-secondary text-decoration-none">Việc làm</a>
                    <span className="text-muted">|</span>
                    <a href="#" className="text-secondary text-decoration-none">Liên hệ</a>

                </div>

                <div className="d-flex align-items-center gap-2 text-nowrap">
                    <span>Theo dõi báo trên</span>
                    <a href="https://www.youtube.com/channel/UCIW9cGgoRuGJnky3K3tbzNg" target="_blank" rel="noreferrer" className="text-danger fs-5">
                        <i className="fa-brands fa-youtube"></i>
                    </a>
                    <a href="https://www.facebook.com/thanhnien" target="_blank" rel="noreferrer" className="text-primary fs-5">
                        <i className="fa-brands fa-facebook"></i>
                    </a>
                    <a href="https://www.tiktok.com/baothanhnien.official" target="_blank" rel="noreferrer" className="text-dark fs-5">
                        <i className="fa-brands fa-tiktok"></i>
                    </a>
                    <a href="https://zalo.me/2431025964363015388" target="_blank" rel="noreferrer" className="d-flex">
                        <img src="https://thanhnien-static.mediacdn.vn/thanhnien.vn/image/icon_zalo_full_color.svg" width="20" height="20" alt="Zalo" />
                    </a>
                </div>

            </div>

            {status === 'failed' && (
                <div className="container text-danger mt-1">
                    {error}
                </div>
            )}

        </div>
    );
}