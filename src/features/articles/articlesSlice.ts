import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Article } from './types'

interface ArticlesState {
    list: Article[]
    loading: boolean
    error: string | null
}

const initialState: ArticlesState = {
    list: [],
    loading: false,
    error: null,
}

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        fetchStart(state) {
            state.loading = true
            state.error = null
        },
        fetchSuccess(state, action: PayloadAction<Article[]>) {
            state.list = action.payload
            state.loading = false
        },
        fetchFailure(state, action: PayloadAction<string>) {
            state.loading = false
            state.error = action.payload
        },
    },
})

export const { fetchStart, fetchSuccess, fetchFailure } = articlesSlice.actions
export default articlesSlice.reducer