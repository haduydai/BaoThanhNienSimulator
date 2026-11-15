export const getWeatherIcon = (code: number | null, isDay: number | null) => {
    if (code === null || code === undefined) return { icon: 'fa-cloud', color: 'text-secondary' };
    if (code === 0) return { icon: isDay ? 'fa-sun' : 'fa-moon', color: 'text-warning' };
    if ([1, 2].includes(code)) return { icon: isDay ? 'fa-cloud-sun' : 'fa-cloud-moon', color: 'text-warning' };
    if (code === 3) return { icon: 'fa-cloud', color: 'text-secondary' };
    if ([45, 48].includes(code)) return { icon: 'fa-smog', color: 'text-secondary' };
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code)) return { icon: 'fa-cloud-rain', color: 'text-primary' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: 'fa-snowflake', color: 'text-info' };
    if ([80, 81, 82].includes(code)) return { icon: 'fa-cloud-showers-heavy', color: 'text-primary' };
    if ([95, 96, 99].includes(code)) return { icon: 'fa-cloud-bolt', color: 'text-warning' };
    return { icon: 'fa-cloud', color: 'text-secondary' };
};