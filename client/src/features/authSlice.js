import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
    },
    reducers: {
        logout: () => {
            localStorage.clear()
        }
    }
})

export const { logout } = authSlice.actions;

export default authSlice.reducer;