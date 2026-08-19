import { createContext, useState, useEffect } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext();

function AuthProvider({ children }) {

    // null = аноним, объект = залогиненный пользователь
    const [user, setUser] = useState(null);

    // true, пока мы выясняем, есть ли сохраненная сессия
    const [initializing, setInitializing] = useState(true);

    // Восстановление сессии при загрузке приложения
    useEffect(() => {
        let ignore = false;

        async function restoreSession() {
            try {
                const me = await authApi.getMe();

                if (!ignore) setUser(me);
            } catch {
                // 401 - пользователь просто не залогинен, это не ошибка
            } finally {
                if (!ignore) setInitializing(false);
            }
        }

        restoreSession();

        return () => {
            ignore = true;
        };
    }, []);

    async function login(username, password) {
        const loggedInUser = await authApi.login(username, password);
        setUser(loggedInUser);
    }

    async function register(username, email, password) {
        const newUser = await authApi.register(username, email, password);
        setUser(newUser);
    }

    async function logout() {
        try {
            await authApi.logout();
        } finally {
            // даже если запрос на сервер не удался, локально разлогиниваемся
            setUser(null);
        }
    }

    async function updateProfile(data) {
        const updated = await authApi.updateMe(data);
        setUser(updated);
        return updated;
    }

    return (
        <AuthContext.Provider
            value={{ user, initializing, login, register, logout, updateProfile }}>

            {children}

        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };