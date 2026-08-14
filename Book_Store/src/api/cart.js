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

// Атомарное изменение количества на сервере (+1 / -1):
// сервер сам читает текущее значение под блокировкой,
// поэтому быстрые клики не теряются
export function changeCartItemQuantity(itemId, delta) {
    return api.post(`/cart/item/${itemId}/change/`, { delta });
}

export function removeCartItem(itemId) {
    return api.delete(`/cart/item/${itemId}/delete/`);
}

export function clearCart() {
    return api.delete("/cart/clear/");
}