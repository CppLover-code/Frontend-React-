import { api } from "./client";

// Paginated response: { count, next, previous, results }
export function getBooks(params = {}) {

    const query = new URLSearchParams(params).toString();

    return api.get(`/books/${query ? `?${query}` : ""}`);
}

export function getBook(id) {
    return api.get(`/books/${id}/`);
}