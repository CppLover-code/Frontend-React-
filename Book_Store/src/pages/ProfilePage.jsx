import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useNotification from "../hooks/useNotification";
import { Navigate } from "react-router-dom";

const fieldClass =
    "input-field";

function ProfileField({ label, value, editing, onChange }) {
    return (
        <label className="field-label">
            {label}
            {editing ? (
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    className={fieldClass}
                />
            ) : (
                <p className="border border-line bg-paper-muted px-3 py-2 text-sm font-medium text-ink dark:border-night-border dark:bg-night dark:text-paper">
                    {value.trim() ? value : "—"}
                </p>
            )}
        </label>
    );
}

function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const { showNotification } = useNotification();

    const [phone, setPhone] = useState(user.phone ?? "");
    const [city, setCity] = useState(user.city ?? "");
    const [street, setStreet] = useState(user.street ?? "");
    const [postalCode, setPostalCode] = useState(user.postal_code ?? "");
    const [submitting, setSubmitting] = useState(false);
    const [firstName, setFirstName] = useState(user.first_name ?? "");
    const [lastName, setLastName] = useState(user.last_name ?? "");
    const [editing, setEditing] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);

        try {
            await updateProfile({
                first_name: firstName,
                last_name: lastName,
                phone,
                city,
                street,
                postal_code: postalCode,
            });
            showNotification({
                message: "Profile saved",
                type: "success",
            });
            setEditing(false);
        } catch {
            showNotification({
                message: "Failed to save profile",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    }

    function resetFromUser() {
        setFirstName(user.first_name ?? "");
        setLastName(user.last_name ?? "");
        setPhone(user.phone ?? "");
        setCity(user.city ?? "");
        setStreet(user.street ?? "");
        setPostalCode(user.postal_code ?? "");
    }

    function handleCancel() {
        resetFromUser();
        setEditing(false);
    }

    if (user.is_staff) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="mx-auto max-w-md">
            <form
                onSubmit={handleSubmit}
                className="card-surface space-y-4 p-6"
            >
                <h1 className="page-title text-[2rem]">Profile</h1>

                <label className="field-label">
                    Username
                    <input type="text" value={user.username} disabled className={`${fieldClass} bg-paper-muted dark:bg-night-shelf`} />
                </label>

                <label className="field-label">
                    Email
                    <input type="email" value={user.email} disabled className={`${fieldClass} bg-paper-muted dark:bg-night-shelf`} />
                </label>

                <ProfileField
                    label="First name"
                    value={firstName}
                    editing={editing}
                    onChange={(event) => setFirstName(event.target.value)}
                />

                <ProfileField
                    label="Last name"
                    value={lastName}
                    editing={editing}
                    onChange={(event) => setLastName(event.target.value)}
                />

                <ProfileField
                    label="Phone"
                    value={phone}
                    editing={editing}
                    onChange={(event) => setPhone(event.target.value)}
                />

                <ProfileField
                    label="City"
                    value={city}
                    editing={editing}
                    onChange={(event) => setCity(event.target.value)}
                />

                <ProfileField
                    label="Street"
                    value={street}
                    editing={editing}
                    onChange={(event) => setStreet(event.target.value)}
                />

                <ProfileField
                    label="Postal code"
                    value={postalCode}
                    editing={editing}
                    onChange={(event) => setPostalCode(event.target.value)}
                />

                {editing ? (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn-muted flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary flex-1"
                        >
                            {submitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="btn-primary w-full"
                    >
                        Edit
                    </button>
                )}
            </form>
        </div>
    );
}

export default ProfilePage;