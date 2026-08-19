import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useNotification from "../hooks/useNotification";

const fieldClass =
    "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200";

function ProfileField({ label, value, editing, onChange }) {
    return (
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
            {label}
            {editing ? (
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    className={fieldClass}
                />
            ) : (
                <p className="rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900">
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

    return (
        <div className="mx-auto max-w-md">
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Username
                    <input type="text" value={user.username} disabled className={`${fieldClass} bg-gray-100`} />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Email
                    <input type="email" value={user.email} disabled className={`${fieldClass} bg-gray-100`} />
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
                            className="flex-1 cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 cursor-pointer rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {submitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="w-full cursor-pointer rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
                    >
                        Edit
                    </button>
                )}
            </form>
        </div>
    );
}

export default ProfilePage;