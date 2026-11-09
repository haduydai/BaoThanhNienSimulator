import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'tn_theme';

type ThemeMode = 'light' | 'dark';

function loadTheme(): ThemeMode {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDom(theme: ThemeMode): void {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
}

interface ThemeState {
    mode: ThemeMode;
}

const resolvedInitialTheme = loadTheme()
applyThemeToDom(resolvedInitialTheme);

const initialState: ThemeState = {
    mode: resolvedInitialTheme,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme(state) {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            localStorage.setItem(STORAGE_KEY, state.mode);
            applyThemeToDom(state.mode);
        },

        setTheme(state, action: { payload: ThemeMode }) {
            state.mode = action.payload;
            localStorage.setItem(STORAGE_KEY, state.mode);
            applyThemeToDom(state.mode);
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;