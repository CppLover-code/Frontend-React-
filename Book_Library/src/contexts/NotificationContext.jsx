import { createContext, useState } from "react";

const NotificationContext = createContext();

function NotificationProvider({ children }) {

    const [notification, setNotification] = useState(null);

    
    return (
        <NotificationContext.Provider value={
                {   
                    notification,
                    setNotification
                }
            }>

            {children}

        </NotificationContext.Provider>
    );
}

export { NotificationContext, NotificationProvider };