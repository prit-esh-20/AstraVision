import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface RoleProtectedRouteProps {
    children: ReactNode;
    allowedRoles: ('admin' | 'user')[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
    const { role, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(role as 'admin' | 'user')) {
        if (role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (role === 'user') {
            return <Navigate to="/dashboard" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default RoleProtectedRoute;
