import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api';

export const registerUser = createAsyncThunk('auth/register', async ({ full_name, email, password }, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/register', { full_name, email, password });
        localStorage.setItem('finsim_token', data.token);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
});

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('finsim_token', data.token);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/auth/me');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Could not fetch user');
    }
});

const token = localStorage.getItem('finsim_token');

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: token || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('finsim_token');
            localStorage.removeItem('userProfile');
            localStorage.removeItem('userName');
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = { _id: action.payload.user_id, email: action.payload.email, full_name: action.payload.full_name };
            })
            .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = { _id: action.payload.user_id, email: action.payload.email, full_name: action.payload.full_name };
            })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; })
            .addCase(fetchMe.rejected, (state) => { state.token = null; state.user = null; localStorage.removeItem('finsim_token'); });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
