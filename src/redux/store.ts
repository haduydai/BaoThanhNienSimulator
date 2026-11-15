import { configureStore } from '@reduxjs/toolkit';
import {type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import weatherReducer from './slices/weatherSlice.ts';
import newsReducer from './slices/newsSlice';
import bookmarkReducer from './slices/bookmarkSlice';
import themeReducer from './slices/themeSlice';
// import articlesReducer from '../features/articles/articlesSlice';

export const store = configureStore({
    reducer: {
        weather: weatherReducer,
        news: newsReducer,
        bookmark: bookmarkReducer,
        theme: themeReducer,
        // articles: articlesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
