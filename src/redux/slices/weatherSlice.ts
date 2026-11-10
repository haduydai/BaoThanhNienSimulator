import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCityCoordinates, getWeather } from '../../api/weatherApi.ts';

export const fetchWeatherByCity = createAsyncThunk(
    'weather/fetchWeatherByCity',
    async (cityName: string) => {
        const city = await getCityCoordinates(cityName);
        const weather = await getWeather(city.latitude, city.longitude);

        return {
            selectedCity: city.name,
            country: city.country,
            temp: weather.temperature_2m,
            condition: weather.weather_code,
            isDay: weather.is_day
        };
    }
);

interface WeatherState {
    selectedCity: string | null;
    country: string;
    temp: number | null;
    condition: number | null;
    isDay: number | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: WeatherState = {
    selectedCity: null,
    country: '',
    temp: null,
    condition: null,
    isDay: null,
    status: 'idle',
    error: null
};

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeatherByCity.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchWeatherByCity.fulfilled, (state, action) => {
                state.status = 'succeeded';
                Object.assign(state, action.payload);
            })
            .addCase(fetchWeatherByCity.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Đã xảy ra lỗi khi lấy thời tiết';
            });
    }
});

export default weatherSlice.reducer;