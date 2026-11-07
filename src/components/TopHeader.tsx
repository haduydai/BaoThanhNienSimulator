import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCity } from '../redux/weatherSlice.js';

const WEATHER_TYPES = {
    1: { icon: 'https://static.mediacdn.vn/images/icon_weather/it-may.png' },
    2: { icon: 'https://static.mediacdn.vn/images/icon_weather/nhieu-may.png' },
    3: { icon: 'https://static.mediacdn.vn/images/icon_weather/mua.png' },
    4: { icon: 'https://static.mediacdn.vn/images/icon_weather/nang.png' },
};

export default function TopHeader() {
    const dispatch = useDispatch();
    const { selectedCity, temp, condition, cityList } = useSelector((state) => state.weather);

    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const currentWeather = WEATHER_TYPES[condition] || WEATHER_TYPES[1];

    const filteredCities = cityList.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectCity = (cityName) => {
        dispatch(selectCity(cityName));
        setIsOpenDropdown(false);
        setSearchQuery('');
    };

    return (
        <div className="bg-light text-secondary py-2 text-nowrap border-bottom" style={{ fontSize: '14px' }}>
            <div className="container d-flex justify-content-between align-items-center">

                <div className="d-flex align-items-center gap-3">
                    <span className="text-dark">Chủ Nhật, 1/11/2026</span>
                    <span className="text-muted">|</span>

                    <div className="position-relative">
                        <div
                            className="d-flex align-items-center gap-2 text-dark"
                            onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>{selectedCity}</span>
                            <i className="fa-solid fa-chevron-down text-muted" style={{ fontSize: '11px' }}></i>
                            <span className="fw-bold">{temp}<sup>o</sup>C</span>
                            <img src={currentWeather.icon} alt="Thời tiết" width="24" height="20" />
                        </div>

                        {isOpenDropdown && (
                            <div
                                className="position-absolute top-100 start-0 bg-white border border-light-subtle rounded shadow-sm p-2 mt-2 z-3"
                                style={{ width: '200px' }}
                            >
                                <div className="input-group input-group-sm mb-2">
                                    <input
                                        type="text"
                                        className="form-control bg-light border-light-subtle text-dark"
                                        placeholder="Nhập tên tỉnh"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <span className="input-group-text bg-light border-light-subtle text-muted">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </span>
                                </div>
                                <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                    {filteredCities.map((item) => (
                                        <div
                                            key={item.name}
                                            onClick={() => handleSelectCity(item.name)}
                                            className="text-dark py-1 px-2 rounded"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                    {filteredCities.length === 0 && (
                                        <div className="text-muted text-center py-1">Không tìm thấy</div>
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

                <div className="d-flex align-items-center gap-2">
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
        </div>
    );
}