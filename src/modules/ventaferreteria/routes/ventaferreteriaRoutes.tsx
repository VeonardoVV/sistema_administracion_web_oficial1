import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../../app/routes/ProtectedRoutes";
import VentaFerreteria from "../pages/ventaferreteriaPage";


export default [
    <Route key="ventaferreteria" path="/ventaferreteria" element={<VentaFerreteria />} />,
    
];