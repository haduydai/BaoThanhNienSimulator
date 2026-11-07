import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import weatherReducer from './weatherSlice';
import newsReducer from './slices/newsSlice';
import bookmarkReducer from './slices/bookmarkSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
    reducer: {
        weather: weatherReducer,
        news: newsReducer,
        bookmark: bookmarkReducer,
        theme: themeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
