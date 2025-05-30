import { Routes, Route } from 'react-router-dom';
import { LandingPage } from "../pages/landingPage";
import { LoginPage } from "../pages/authentication/LoginPage";
import { SignUpPage } from "../pages/authentication/SignUpPage";
import { Layout } from "../pages/app/layout"
import { Home } from "../pages/app/home";
import { Budget } from "../pages/app/screens/Budget";
import { RequireAuth } from '../components/RequireAuth';
import { Review } from '../pages/app/screens/Review';
import { ServicedRoutes } from '../pages/app/screens/ServicedRoutes';
import { Orders } from '../pages/app/screens/Orders';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
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
        <Route path="rotas-atendidas" element={<ServicedRoutes />}/>
        <Route path="solicitacoes" element={<Orders />}/>

        
        <Route path="orcamento" element={<Budget />} />
        <Route path="avaliacoes" element={<Review />}/>
      </Route>
    </Routes>
  );
}
