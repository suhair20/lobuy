import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  // Use the exact state name from your store.js (usually 'auth')
const { isAuthenticated } = useSelector((state) => state.auth);

  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;