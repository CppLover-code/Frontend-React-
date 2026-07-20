import { useEffect } from "react";

function Notification({ message, type, onClose }) {

    useEffect(() => {

        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    }, [onClose]);

    return (
        <>
            <p>{message}</p>
            <button onClick={() => onClose()}>✖</button>
        </>
    );
}

export default Notification;