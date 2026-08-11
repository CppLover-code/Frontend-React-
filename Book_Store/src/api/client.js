const BASE_URL = import.meta.env.VITE_API_URL;

// Access-токен живет в обычной переменной модуля.
// Перезагрузка страницы его стирает - это нормально,
// сессию восстановит refresh-cookie (см. request ниже).
let accessToken = null;

function setAccessToken(token) {
    accessToken = token;
}

class ApiError extends Error {
    constructor(status, data) {
        super(`API error ${status}`);
        this.status = status;
        this.data = data;
    }
}

// "Сырой" запрос: один HTTP-вызов без всякой магии
async function rawRequest(path, { method = "GET", body } = {}) {

    const headers = {};

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 204) return null;

    const data = await response.json();

    if (!response.ok) {
        throw new ApiError(response.status, data);
    }

    return data;
}

// Умный запрос: при 401 пробует обновить access-токен и повторить
async function request(path, options = {}) {
    try {
        return await rawRequest(path, options);
    } catch (err) {

        const canRetry = err instanceof ApiError && err.status === 401;

        if (!canRetry) throw err;

        let refreshData;
        try {
            refreshData = await rawRequest("/users/refresh/", { method: "POST" });
        } catch {
            // refresh-cookie нет или она истекла - пользователь действительно не залогинен,
            // пробрасываем исходную ошибку
            throw err;
        }

        setAccessToken(refreshData.access);

        return rawRequest(path, options);
    }
}

const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: "POST", body }),
    patch: (path, body) => request(path, { method: "PATCH", body }),
    delete: (path) => request(path, { method: "DELETE" }),
};

export { api, ApiError, setAccessToken };