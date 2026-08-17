import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function RegisterPage() {

    const { register } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // server errors: { username: ["..."], email: ["..."] }
    const [serverErrors, setServerErrors] = useState({});
    const [localError, setLocalError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setServerErrors({});
        setLocalError("");

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        setSubmitting(true);

        try {
            await register(username, email, password);
            navigate("/", { replace: true });
        } catch (err) {
            // DRF returns field-level errors: {"username": ["A user with that username already exists."]}
            if (err.data && typeof err.data === "object") {
                setServerErrors(err.data);
            } else {
                setLocalError("Registration failed. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-md">
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h1 className="text-2xl font-bold text-gray-900">Register</h1>
    
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    />
                    {serverErrors.username && (
                        <p className="text-sm text-red-600">{serverErrors.username[0]}</p>
                    )}
                </label>
    
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    />
                    {serverErrors.email && (
                        <p className="text-sm text-red-600">{serverErrors.email[0]}</p>
                    )}
                </label>
    
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    />
                    {serverErrors.password && (
                        <p className="text-sm text-red-600">{serverErrors.password[0]}</p>
                    )}
                </label>
    
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Confirm password
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    />
                </label>
    
                {localError && <p className="text-sm text-red-600">{localError}</p>}
    
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full cursor-pointer rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {submitting ? "Registering..." : "Register"}
                </button>
    
                <p className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-teal-700 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;