import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   data: JSON.parse(window.localStorage.getItem('authState') || '{}').data,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthState: (state, action) => {
            state.data = action.payload;
            localStorage.setItem('authState', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.data = null;
            localStorage.removeItem('authState');
        }
    }
})

export const { setAuthState, logout } = authSlice.actions;
export default authSlice.reducer;
