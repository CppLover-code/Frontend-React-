import { api } from "./client";

// Paginated response: { count, next, previous, results }
export function getBooks(params = {}) {

    const query = new URLSearchParams(params).toString();

    return api.get(`/books/${query ? `?${query}` : ""}`);
}

export function getBook(id) {
    return api.get(`/books/${id}/`);
}

export function createBook(data) {
    return api.post("/books/", data)
}

export function updateBook(id, data) {
    return api.patch(`/books/${id}/`, data);
}

export function deleteBook(id) {
    return api.delete(`/books/${id}/`);
}

export function getAuthors() {
    return api.get("/authors/");
}

export function createAuthor(name) {
    return api.post("/authors/", { name });
}

export function getCategories() {
    return api.get("/categories/");
}

export function createCategory(name) {
    return api.post("/categories/", { name });
}