import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedCity: 'Hồ Chí Minh',
    temp: '34',
    condition: 1,

    cityList: [
        { name: 'Hồ Chí Minh', temp: '34', condition: 1 },
        { name: 'Hà Nội', temp: '28', condition: 2 },
        { name: 'Đà Nẵng', temp: '31', condition: 4 },
        { name: 'Đà Lạt', temp: '20', condition: 3 },
        { name: 'Cần Thơ', temp: '33', condition: 1 },
        { name: 'An Giang', temp: '32', condition: 2 },
        { name: 'Bình Dương', temp: '34', condition: 1 },
    ]
};

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        selectCity: (state, action) => {
            const cityItem = state.cityList.find(c => c.name === action.payload);
            if (cityItem) {
                state.selectedCity = cityItem.name;
                state.temp = cityItem.temp;
                state.condition = cityItem.condition;
            }
        },
    },
});

export const { selectCity } = weatherSlice.actions;
export default weatherSlice.reducer;