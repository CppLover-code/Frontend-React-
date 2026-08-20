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
                className="card-surface space-y-4 p-6"
            >
                <h1 className="page-title text-[2rem]">Register</h1>
    
                <label className="field-label">
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="input-field"
                    />
                    {serverErrors.username && (
                        <p className="text-sm text-red-700">{serverErrors.username[0]}</p>
                    )}
                </label>
    
                <label className="field-label">
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="input-field"
                    />
                    {serverErrors.email && (
                        <p className="text-sm text-red-700">{serverErrors.email[0]}</p>
                    )}
                </label>
    
                <label className="field-label">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="input-field"
                    />
                    {serverErrors.password && (
                        <p className="text-sm text-red-700">{serverErrors.password[0]}</p>
                    )}
                </label>
    
                <label className="field-label">
                    Confirm password
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="input-field"
                    />
                </label>
    
                {localError && <p className="text-sm text-red-700">{localError}</p>}
    
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full"
                >
                    {submitting ? "Registering..." : "Register"}
                </button>
    
                <p className="text-center text-sm text-muted dark:text-faint">
                    Already have an account?{" "}
                    <Link to="/login" className="link-accent">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;