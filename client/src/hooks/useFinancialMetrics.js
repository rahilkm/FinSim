import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../features/profile/profileSlice';
import { fetchResilience } from '../features/resilience/resilienceSlice';

/**
 * Shared hook to compute and provide all financial metrics for the 
 * unified Financial Overview page.
 * 
 * Uses ONE source of truth (profile and resilience API) to avoid
 * recomputing values separately and duplicating formulas.
 */
export default function useFinancialMetrics() {
    const dispatch = useDispatch();
    const { data: profile, loading: profileLoading } = useSelector((s) => s.profile);
    const { result: resilience, loading: resilienceLoading, error } = useSelector((s) => s.resilience);

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchResilience());
    }, [dispatch]);

    const loading = profileLoading || resilienceLoading;

    // Use ONE source of truth for the shared data
    const r = resilience || {};
    const p = profile || {};

    const income = p.monthly_income || 0;
    const expenses = p.monthly_expenses || 0;
    const emi = p.existing_emi || 0;
    const savings = Math.max(income - expenses - emi, 0);

    return {
        loading,
        error,
        hasProfile: !!profile,
        
        // Expense bar chart
        income,
        expenses,
        emi,
        savings,

        // Core metrics computed from the backend to avoid duplicating formulas
        netWorth: r.net_worth || 0,
        savingsRate: r.savings_rate || 0,
        emergencyMonths: r.emergency_months || 0,
        debtToIncome: r.debt_to_income || 0,
        
        assetAllocation: r.asset_allocation || [],
        assets: p.assets || [],
        
        // Resilience / Health metrics
        financialHealthScore: r.financial_health_score || 0,
        riskLevel: r.risk_level || '—',
        radarData: r.radar_data,
        recommendations: r.recommendations || [],
        
        // Individual dimension scores
        savingsScore: r.savings_score || 0,
        debtScore: r.debt_score || 0,
        emergencyFundScore: r.emergency_fund_score || 0,
    };
}
