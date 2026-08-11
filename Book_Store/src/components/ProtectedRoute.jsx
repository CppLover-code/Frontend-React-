import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({staffOnly = false}) {

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

    if (staffOnly && !user.is_staff) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;