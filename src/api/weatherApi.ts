export async function getCityCoordinates(cityName: string) {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=vi&format=json`
    );

    const data = await response.json();
    if (!response.ok || !data.results?.length) {
        throw new Error('Không tìm thấy thành phố');
    }

    return data.results[0];
}

const WEATHER_FIELDS = ['temperature_2m', 'weather_code', 'is_day'].join(',');

export async function getWeather(latitude: number, longitude: number) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${WEATHER_FIELDS}&timezone=Asia%2FHo_Chi_Minh`
    );

    const data = await response.json();
    if (!response.ok || !data?.current) {
        throw new Error('Không thể lấy dữ liệu thời tiết');
    }

    return data.current;
}