import { Navigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';

export function RequireAuth({ children }) {
  // const isAuthenticated = localStorage.getItem("usuario") ? true : false;
  const isAuthenticated = Cookies.get('usuario') ? true : false;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
