import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

function LoginPage() {

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await login(username, password);

            // если нас сюда перенаправил ProtectedRoute,
            // возвращаемся туда, куда пользователь шел изначально
            const from = location.state?.from ?? "/";
            navigate(from, { replace: true });
        } catch {
            setError("Invalid username or password");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>

            <label>Username: </label>
            <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />

            <br />
            <br />

            <label>Password: </label>
            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <br />
            <br />

            {error && <p className="error-message">{error}</p>}

            <button type="submit" disabled={submitting}>
                {submitting ? "Logging in..." : "Login"}
            </button>

            <p>
                No account? <Link to="/register">Register</Link>
            </p>

        </form>
    );
}

export default LoginPage;