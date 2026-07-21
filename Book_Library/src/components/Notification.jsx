import { useEffect } from "react";
import "../styles/Notification.css"

function Notification({ message, type, onClose }) {

    useEffect(() => {

        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    }, [onClose]);

    const className = 
        type === "success"
        ? "notification success"
        : type === "error"
        ? "notification error"
        : "notification warning";

    return (
        <div className={className}>
            <p>{message}</p>
            <button onClick={() => onClose()}>✖</button>
        </div>
    );
}

export default Notification;