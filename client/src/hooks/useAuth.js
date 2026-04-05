import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function useAuth(redirectTo = '/auth') {
    const { user, token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate(redirectTo);
        }
    }, [token, navigate, redirectTo]);

    return { user, token, isAuthenticated: !!token };
}
