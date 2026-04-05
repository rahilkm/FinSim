import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import shockReducer from '../features/shock/shockSlice';
import decisionReducer from '../features/decision/decisionSlice';
import resilienceReducer from '../features/resilience/resilienceSlice';

const appReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    dashboard: dashboardReducer,
    shock: shockReducer,
    decision: decisionReducer,
    resilience: resilienceReducer,
});

const rootReducer = (state, action) => {
    // Completely clear Redux state unmounting previous sessions' data
    // to strictly enforce session isolation on new login/logout events.
    if (
        action.type === 'auth/logout' ||
        action.type === 'auth/login/fulfilled' ||
        action.type === 'auth/register/fulfilled'
    ) {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userName');
        state = undefined;
    }
    return appReducer(state, action);
};

const store = configureStore({
    reducer: rootReducer,
});

export default store;
