import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './features/modalSlice'
import themeReducer from './features/themeSlice'
import authReducer from './features/authSlice'

export const store = configureStore({
    reducer: {
        modal: modalReducer,
        theme: themeReducer,
        auth: authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
