import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';
import articlesReducer from '../features/articles/articlesSlice';

export const store = configureStore({
    reducer: {
        weather: weatherReducer,
        articles: articlesReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
