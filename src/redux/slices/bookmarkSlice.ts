import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { NewsArticle } from '../../services/rssService';

const STORAGE_KEY = 'tn_bookmarks';

function loadFromStorage(): NewsArticle[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as NewsArticle[]) : [];
    } catch {
        return [];
    }
}

function saveToStorage(articles: NewsArticle[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (err) {
        console.error('[bookmarkSlice] Không thể lưu bookmark:', err);
    }
}

interface BookmarkState {
    bookmarks: NewsArticle[];
}

const initialState: BookmarkState = {
    bookmarks: loadFromStorage(),
};

const bookmarkSlice = createSlice({
    name: 'bookmark',
    initialState,
    reducers: {
        addBookmark(state, action: PayloadAction<NewsArticle>) {
            const exists = state.bookmarks.some((b) => b.id === action.payload.id);
            if (!exists) {
                state.bookmarks.unshift(action.payload);   // Thêm lên đầu danh sách
                saveToStorage(state.bookmarks);
            }
        },

        removeBookmark(state, action: PayloadAction<string>) {
            state.bookmarks = state.bookmarks.filter((b) => b.id !== action.payload);
            saveToStorage(state.bookmarks);
        },

        clearAllBookmarks(state) {
            state.bookmarks = [];
            localStorage.removeItem(STORAGE_KEY);
        },
    },
});

export function selectIsBookmarked(articleId: string) {
    return (state: { bookmark: BookmarkState }): boolean =>
        state.bookmark.bookmarks.some((b) => b.id === articleId);
}

export const { addBookmark, removeBookmark, clearAllBookmarks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;

