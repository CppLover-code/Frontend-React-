import { useEffect } from "react";
import useNotification from "../hooks/useNotification";
import "../styles/Notification.css"

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

    const className =
        notification.type === "success"
            ? "notification success"
            : notification.type === "error"
                ? "notification error"
                : "notification warning";

    return (
        <div className={className}>
            <p>{notification.message}</p>
            <button onClick={hideNotification}>✖</button>
        </div>
    );
}

export default Notification;