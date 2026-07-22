import { createContext, useState } from "react";

const NotificationContext = createContext();

function NotificationProvider({ children }) {

    const [notification, setNotification] = useState(null);

    const showNotification = (newNotification) => {

        setNotification(newNotification);
    };

    const hideNotification = () => {

        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{
            notification,
            showNotification,
            hideNotification
        }}>

            {children}

        </NotificationContext.Provider>
    );
}

export { NotificationContext, NotificationProvider };