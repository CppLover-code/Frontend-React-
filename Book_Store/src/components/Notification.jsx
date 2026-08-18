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
        success: "bg-teal-700 text-white",
        error: "bg-red-600 text-white",
        warning: "bg-amber-500 text-white",
    };

    return (
        <div className={`fixed right-4 top-4 z-50 flex items-center gap-3 rounded-md px-4 py-3 shadow-lg ${colors[notification.type] ?? colors.warning}`}>
            <p className="text-sm font-medium">{notification.message}</p>
            <button
                onClick={hideNotification}
                className="cursor-pointer text-lg leading-none opacity-80 hover:opacity-100"
            >
                ✖
            </button>
        </div>
    );
}

export default Notification;