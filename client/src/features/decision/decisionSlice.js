import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api';

export const runDecisionSimulation = createAsyncThunk('decision/run', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/simulate/decision', params);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Decision simulation failed');
    }
});

const decisionSlice = createSlice({
    name: 'decision',
    initialState: { result: null, loading: false, error: null },
    reducers: {
        clearDecision(state) { state.result = null; state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(runDecisionSimulation.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(runDecisionSimulation.fulfilled, (state, action) => { state.loading = false; state.result = action.payload; })
            .addCase(runDecisionSimulation.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { clearDecision } = decisionSlice.actions;
export default decisionSlice.reducer;
