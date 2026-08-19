import { api, setAccessToken } from "./client";

export async function login(username, password) {
    const data = await api.post("/users/login/", { username, password });

    setAccessToken(data.access);

    return data.user;
}

export async function register(username, email, password) {
    const data = await api.post("/users/register/", { username, email, password });

    setAccessToken(data.access);

    return data.user;
}

export async function logout() {
    await api.post("/users/logout/");

    setAccessToken(null);
}

export function getMe() {
    return api.get("/users/me/");
}

export function updateMe(data) {
    return api.patch("/users/me/", data);
}