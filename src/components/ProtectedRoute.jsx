import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { rolesMatch, getDashboardPathForRole } from '../utils/roleUtils';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { currentUser, userRole, userData, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!currentUser.emailVerified) {
        return <Navigate to="/login/verifycode" state={{ email: currentUser.email, from: location }} replace />;
    }

    if (userData?.isBanned === true || userData?.status === 'inactive') {
        return <Navigate to="/login" state={{ banned: true }} replace />;
    }

    if (requiredRole && !rolesMatch(userRole, requiredRole)) {
        const home = getDashboardPathForRole(userRole);
        return <Navigate to={home === '/' ? '/' : home} replace />;
    }

    return children;
};

export default ProtectedRoute;
