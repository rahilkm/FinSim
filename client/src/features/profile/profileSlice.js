import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api';

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/profile');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Could not fetch profile');
    }
});

export const saveProfile = createAsyncThunk('profile/save', async (profileData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/profile', profileData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Could not save profile');
    }
});

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearProfileError(state) { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchProfile.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
            .addCase(fetchProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(saveProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(saveProfile.fulfilled, (state) => { state.loading = false; /* do NOT overwrite state.data — form owns its state after initial load */ })
            .addCase(saveProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
