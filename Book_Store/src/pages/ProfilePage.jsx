import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useNotification from "../hooks/useNotification";

const fieldClass =
    "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200";

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
        } catch {
            showNotification({
                message: "Failed to save profile",
                type: "error",
            });
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
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Username
                    <input type="text" value={user.username} disabled className={`${fieldClass} bg-gray-100`} />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Email
                    <input type="email" value={user.email} disabled className={`${fieldClass} bg-gray-100`} />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Phone
                    <input
                        type="text"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        className={fieldClass}
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    City
                    <input
                        type="text"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        className={fieldClass}
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Street
                    <input
                        type="text"
                        value={street}
                        onChange={(event) => setStreet(event.target.value)}
                        className={fieldClass}
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Postal code
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(event) => setPostalCode(event.target.value)}
                        className={fieldClass}
                    />
                </label>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full cursor-pointer rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {submitting ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
}

export default ProfilePage;