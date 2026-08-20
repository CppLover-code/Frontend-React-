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
            const from = location.state?.from ?? "/";
            navigate(from, { replace: true });
        } catch {
            setError("Invalid username or password");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-md">
            <form
                onSubmit={handleSubmit}
                className="card-surface space-y-4 p-6"
            >
                <h1 className="page-title text-[2rem]">Login</h1>
    
                <label className="field-label">
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="input-field"
                    />
                </label>
    
                <label className="field-label">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="input-field"
                    />
                </label>
    
                {error && <p className="text-sm text-red-700">{error}</p>}
    
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full"
                >
                    {submitting ? "Logging in..." : "Login"}
                </button>
    
                <p className="text-center text-sm text-muted dark:text-faint">
                    No account?{" "}
                    <Link to="/register" className="link-accent">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;