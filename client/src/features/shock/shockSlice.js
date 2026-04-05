import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api';

export const runShockSimulation = createAsyncThunk('shock/run', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/simulate/shock', params);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Shock simulation failed');
    }
});

const shockSlice = createSlice({
    name: 'shock',
    initialState: { result: null, loading: false, error: null },
    reducers: {
        clearShock(state) { state.result = null; state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(runShockSimulation.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(runShockSimulation.fulfilled, (state, action) => { state.loading = false; state.result = action.payload; })
            .addCase(runShockSimulation.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { clearShock } = shockSlice.actions;
export default shockSlice.reducer;
