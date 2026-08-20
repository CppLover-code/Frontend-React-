import { useEffect } from "react";
import useNotification from "../hooks/useNotification";

function Notification() {

    const { notification, hideNotification } = useNotification();

    useEffect(() => {

 if (!notification) return;
    
        const timer = setTimeout(() => {
            hideNotification();
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    }, [notification, hideNotification]);

    if (!notification) return null;

    const colors = {
        success: "border-gold text-gold",
        error: "border-brick text-brick",
        warning: "border-accent text-gold dark:text-accent",
    };

    return (
        <div
            className={`fixed right-4 z-50 flex max-w-[min(24rem,calc(100vw-2rem))] items-center gap-3 border border-l-4 bg-paper px-4 py-3 dark:bg-night-card ${colors[notification.type] ?? colors.warning}`}
            style={{ top: "calc(var(--header-height, 4rem) + 1rem)" }}
        >
            <p className="text-sm font-medium">{notification.message}</p>
            <button
                type="button"
                onClick={hideNotification}
                aria-label="Close"
                className="cursor-pointer text-current"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                >
                    <path d="M6 6l12 12M18 6L6 18" />
                </svg>
            </button>
        </div>
    );
}

export default Notification;