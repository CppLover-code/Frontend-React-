const BASE_URL = import.meta.env.VITE_API_URL;

// own error: besides the text, it carries the HTTP status and the response body from DRF.
// Later, by status: 401 - logout, 400 - show form errors.
class ApiError extends Error {
    constructor(status, data) {
        super(`API error ${status}`);
        this.status = status;
        this.data = data;
    }
}

async function request(path, { method = "GET", body } = {}) {

    const headers = {};

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    // 204 No Content nothing to return
    if (response.status === 204) return null;

    const data = await response.json();

    // fetch does not throw an error on 404/500 - only on network errors.
    if (!response.ok) {
        throw new ApiError(response.status, data);
    }

    return data;
}

const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: "POST", body }),
    patch: (path, body) => request(path, { method: "PATCH", body }),
    delete: (path) => request(path, { method: "DELETE" }),
};

export { api, ApiError };