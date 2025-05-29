import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'farmer' | 'buyer';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to the appropriate dashboard based on user role
    if (user?.role === 'farmer') {
      return <Navigate to="/farmer/dashboard" replace />;
    } else if (user?.role === 'buyer') {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 