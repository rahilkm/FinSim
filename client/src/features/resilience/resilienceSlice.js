import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api';

export const fetchResilience = createAsyncThunk('resilience/fetch', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/analysis/resilience');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Resilience analysis failed');
    }
});

const resilienceSlice = createSlice({
    name: 'resilience',
    initialState: { result: null, loading: false, error: null },
    reducers: {
        clearResilience(state) { state.result = null; state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchResilience.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchResilience.fulfilled, (state, action) => { state.loading = false; state.result = action.payload; })
            .addCase(fetchResilience.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { clearResilience } = resilienceSlice.actions;
export default resilienceSlice.reducer;
