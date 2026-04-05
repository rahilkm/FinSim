import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { fetchProfile } from '../../features/profile/profileSlice';

export default function RequireProfile() {
    const dispatch = useDispatch();
    const { data: profile } = useSelector((state) => state.profile);
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        if (!profile) {
            dispatch(fetchProfile()).finally(() => setIsFetched(true));
        } else {
            setIsFetched(true);
        }
    }, [dispatch, profile]);

    if (!isFetched) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
            </div>
        );
    }

    return profile ? <Outlet /> : <Navigate to="/profile" replace />;
}
