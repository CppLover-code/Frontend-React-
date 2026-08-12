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
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>

            <label>Username: </label>
            <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />
            {serverErrors.username && (
                <p className="error-message">{serverErrors.username[0]}</p>
            )}

            <br />
            <br />

            <label>Email: </label>
            <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            {serverErrors.email && (
                <p className="error-message">{serverErrors.email[0]}</p>
            )}

            <br />
            <br />

            <label>Password: </label>
            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            {serverErrors.password && (
                <p className="error-message">{serverErrors.password[0]}</p>
            )}

            <br />
            <br />

            <label>Confirm password: </label>
            <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
            />

            <br />
            <br />

            {localError && <p className="error-message">{localError}</p>}

            <button type="submit" disabled={submitting}>
                {submitting ? "Registering..." : "Register"}
            </button>

            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </form>
    );
}

export default RegisterPage;