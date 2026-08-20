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
                className="space-y-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-6 shadow-sm"
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Login</h1>
    
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-teal-800"
                    />
                </label>
    
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-teal-800"
                    />
                </label>
    
                {error && <p className="text-sm text-red-600">{error}</p>}
    
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full cursor-pointer rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {submitting ? "Logging in..." : "Login"}
                </button>
    
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    No account?{" "}
                    <Link to="/register" className="font-medium text-teal-700 dark:text-teal-400 hover:underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;