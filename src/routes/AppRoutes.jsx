import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from "../pages/authentication/LoginPage";
import { SignUpPage } from "../pages/authentication/SignUpPage";
import { Layout } from "../pages/app/layout"
import { Home } from "../pages/app/home";
import { Budget } from "../pages/app/screens/Budget";
import { RequireAuth } from '../components/RequireAuth';
import { Review } from '../pages/app/screens/Review';
import { ManageRoutes } from '../pages/app/screens/ManageRoutes';
import { Orders } from '../pages/app/screens/Orders';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/solicitacoes" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<SignUpPage />} />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="home" element={<Home />} />
        <Route path="rotas-atendidas" element={<ManageRoutes />}/>
        <Route path="solicitacoes" element={<Orders />}/>
        <Route path="orcamento" element={<Budget />} />
        <Route path="avaliacoes" element={<Review />}/>
      </Route>
    </Routes>
  );
}
