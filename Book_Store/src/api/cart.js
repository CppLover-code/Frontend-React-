import { api } from "./client";

export function getCart() {
    return api.get("/cart/");
}

export function addToCart(bookId, quantity = 1) {
    return api.post("/cart/add/", { book_id: bookId, quantity });
}

export function updateCartItem(itemId, quantity) {
    return api.patch(`/cart/item/${itemId}/`, { quantity });
}

export function removeCartItem(itemId) {
    return api.delete(`/cart/item/${itemId}/delete/`);
}

export function clearCart() {
    return api.delete("/cart/clear/");
}