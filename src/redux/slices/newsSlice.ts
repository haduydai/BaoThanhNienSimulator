import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchMultipleFeeds, fetchRssFeed, type NewsArticle } from '../../services/rssService';

interface NewsState {
    articles: NewsArticle[];
    isLoading: boolean;
    isError: boolean;
    errorMessage: string | null;
    currentCategory: string;

    menuArticles: Record<string, NewsArticle[]>;
    menuLoading: string[];
    menuErrors: Record<string, string>;
}

const initialState: NewsState = {
    articles: [],
    isLoading: false,
    isError: false,
    errorMessage: null,
    currentCategory: 'trang-chu',

    menuArticles: {},
    menuLoading: [],
    menuErrors: {},
};

export const fetchNewsByCategory = createAsyncThunk<NewsArticle[], string, { rejectValue: string }>(
    'news/fetchByCategory',
    async (categorySlug, { rejectWithValue }) => {
        try {
            return await fetchRssFeed(categorySlug);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Lỗi tải bài viết';
            return rejectWithValue(message);
        }
    }
);

export const fetchHomeNews = createAsyncThunk<NewsArticle[], string[] | undefined, { rejectValue: string }>(
    'news/fetchHome',
    async (categorySlugs, { rejectWithValue }) => {
        try {
            return await fetchMultipleFeeds(categorySlugs);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Lỗi tải trang chủ';
            return rejectWithValue(message);
        }
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
            state.articles = [];
            state.isError = false;
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNewsByCategory.pending, (state, action) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = null;
                state.currentCategory = action.meta.arg;
            })
            .addCase(fetchNewsByCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.articles = action.payload;
            })
            .addCase(fetchNewsByCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload ?? 'Không thể tải tin';
            })
            .addCase(fetchHomeNews.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = null;
                state.currentCategory = 'trang-chu';
            })
            .addCase(fetchHomeNews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.articles = action.payload;
            })
            .addCase(fetchHomeNews.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload ?? 'Không thể tải tin trang chủ';
            })
            .addCase(fetchNavbarMenuNews.pending, (state, action) => {
                const slug = action.meta.arg;

                state.menuLoading.push(slug);
                delete state.menuErrors[slug];
            })
            .addCase(fetchNavbarMenuNews.fulfilled, (state, action) => {
                const { categorySlug, articles } = action.payload;

                state.menuArticles[categorySlug] = articles;
                state.menuLoading = state.menuLoading.filter(
                    (slug) => slug !== categorySlug
                );
            })
            .addCase(fetchNavbarMenuNews.rejected, (state, action) => {
                const slug = action.meta.arg;

                state.menuLoading = state.menuLoading.filter(
                    (item) => item !== slug
                );

                if (action.payload) {
                    state.menuErrors[slug] = action.payload;
                }
            });

    },
});

export const fetchNavbarMenuNews = createAsyncThunk<
    { categorySlug: string; articles: NewsArticle[] },
    string,
    { rejectValue: string }
>(
    'news/fetchNavbarMenuNews',
    async (categorySlug, { rejectWithValue }) => {
        try {
            const articles = await fetchRssFeed(categorySlug);

            return {
                categorySlug,
                articles,
            };
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Lỗi tải bài viết';

            return rejectWithValue(message);
        }
    },
    {
        condition: (categorySlug, { getState }) => {
            const state = getState() as { news: NewsState };

            return (
                !state.news.menuArticles[categorySlug] &&
                !state.news.menuLoading.includes(categorySlug)
            );
        },
    }
);
export const { setCurrentCategory, clearArticles } = newsSlice.actions;
export default newsSlice.reducer;