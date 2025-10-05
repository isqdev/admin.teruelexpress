import { Navigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';

function isTokenValid(token) {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      console.log('Token expirado');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token inválido:', error);
    return false;
  }
}

export function RequireAuth({ children }) {
  const token = Cookies.get('token');
  const location = useLocation();
  
  const isAuthenticated = token && isTokenValid(token);
  
  if (!isAuthenticated) {
    if (token) {
      Cookies.remove('token');
    }
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
