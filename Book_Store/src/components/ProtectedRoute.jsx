import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute() {

    const { user, initializing } = useAuth();
    const location = useLocation();

    // сессия еще восстанавливается - рано принимать решение
    if (initializing) return <h2>Loading...</h2>;

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;