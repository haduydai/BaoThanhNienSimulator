import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
    fetchRssFeed,
    fetchMultipleFeeds,
    isMatchingArticle,
    getFallbackArticles,
    type NewsArticle,
} from '../../services/rssService';

interface NewsState {
    articles:            NewsArticle[];
    selectedArticle:     NewsArticle | null;
    isLoading:           boolean;
    isFetchingArticle:   boolean;
    isError:             boolean;
    errorMessage:        string | null;
    currentCategory:     string;
}

const initialState: NewsState = {
    articles:            [],
    selectedArticle:     null,
    isLoading:           false,
    isFetchingArticle:   false,
    isError:             false,
    errorMessage:        null,
    currentCategory:     'trang-chu',
};

export const fetchNewsByCategory = createAsyncThunk<
    NewsArticle[],
    string,
    { rejectValue: string }
>(
    'news/fetchByCategory',
    async (categorySlug, { rejectWithValue }) => {
        try {
            return await fetchRssFeed(categorySlug);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Đã xảy ra lỗi khi tải tin tức';
            return rejectWithValue(message);
        }
    }
);

export const fetchHomeNews = createAsyncThunk<
    NewsArticle[],
    string[] | undefined,
    { rejectValue: string }
>(
    'news/fetchHome',
    async (categorySlugs, { rejectWithValue }) => {
        try {
            return await fetchMultipleFeeds(categorySlugs);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Đã xảy ra lỗi khi tải trang chủ';
            return rejectWithValue(message);
        }
    }
);

export const fetchArticleById = createAsyncThunk<
    NewsArticle | null,
    string,
    { rejectValue: string }
>(
    'news/fetchArticleById',
    async (targetId, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState() as { news: NewsState };

            const existing = state.news.articles.find((a) => isMatchingArticle(a, targetId));
            if (existing) return existing;

            const homeAction = await dispatch(fetchHomeNews());
            const homeArticles = (homeAction.payload as NewsArticle[]) || [];
            const foundInHome = homeArticles.find((a) => isMatchingArticle(a, targetId));
            if (foundInHome) return foundInHome;

            const decoded = decodeURIComponent(targetId);
            if (decoded.startsWith('http')) {
                try {
                    const parsedUrl = new URL(decoded);
                    const categorySlug = parsedUrl.pathname.split('/')[1] || 'thoi-su';
                    const catAction = await dispatch(fetchNewsByCategory(categorySlug));
                    const catArticles = (catAction.payload as NewsArticle[]) || [];
                    const foundInCat = catArticles.find((a) => isMatchingArticle(a, targetId));
                    if (foundInCat) return foundInCat;
                } catch {
                }

                const syntheticArticle: NewsArticle = {
                    id: decoded,
                    title: 'Tin tức Báo Thanh Niên',
                    link: decoded,
                    pubDate: new Date().toISOString(),
                    description: '',
                    thumbnail: '',
                    category: 'thoi-su',
                };
                return syntheticArticle;
            }

            const fallbackArticles = getFallbackArticles('thoi-su');
            const foundInFallback = fallbackArticles.find((a) => isMatchingArticle(a, targetId));
            if (foundInFallback) return foundInFallback;

            return null;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Lỗi tải bài viết';
            return rejectWithValue(msg);
        }
    }
);

export const ensureNewsLoaded = createAsyncThunk<
    NewsArticle[],
    void,
    { rejectValue: string }
>(
    'news/ensureLoaded',
    async (_, { getState, dispatch }) => {
        const state = getState() as { news: NewsState };
        if (state.news.articles.length > 0) {
            return state.news.articles;
        }
        const action = await dispatch(fetchHomeNews());
        return (action.payload as NewsArticle[]) || [];
    }
);

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        setCurrentCategory(state, action: PayloadAction<string>) {
            state.currentCategory = action.payload;
        },
        clearArticles(state) {
            state.articles     = [];
            state.isError      = false;
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNewsByCategory.pending, (state, action) => {
                state.isLoading       = true;
                state.isError         = false;
                state.errorMessage    = null;
                state.currentCategory = action.meta.arg;
            })
            .addCase(fetchNewsByCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.articles  = action.payload;
            })
            .addCase(fetchNewsByCategory.rejected, (state, action) => {
                state.isLoading    = false;
                state.isError      = true;
                state.errorMessage = action.payload ?? 'Lỗi không xác định';
            });

        builder
            .addCase(fetchHomeNews.pending, (state) => {
                state.isLoading       = true;
                state.isError         = false;
                state.errorMessage    = null;
                state.currentCategory = 'trang-chu';
            })
            .addCase(fetchHomeNews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.articles  = action.payload;
            })
            .addCase(fetchHomeNews.rejected, (state, action) => {
                state.isLoading    = false;
                state.isError      = true;
                state.errorMessage = action.payload ?? 'Lỗi không xác định';
            });
        builder
            .addCase(fetchArticleById.pending, (state) => {
                state.isFetchingArticle = true;
                state.isError           = false;
                state.errorMessage      = null;
            })
            .addCase(fetchArticleById.fulfilled, (state, action) => {
                state.isFetchingArticle = false;
                state.selectedArticle   = action.payload;
                if (action.payload) {
                    const exists = state.articles.some((a) => isMatchingArticle(a, action.payload!.id));
                    if (!exists) {
                        state.articles.push(action.payload);
                    }
                }
            })
            .addCase(fetchArticleById.rejected, (state, action) => {
                state.isFetchingArticle = false;
                state.errorMessage      = action.payload ?? 'Không tìm thấy bài viết';
            });
    },
});

export const { setCurrentCategory, clearArticles } = newsSlice.actions;
export default newsSlice.reducer;

