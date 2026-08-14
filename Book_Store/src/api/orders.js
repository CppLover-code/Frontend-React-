import { api } from "./client";

export function getOrders(page = 1) {
    return api.get(`/orders/?page=${page}`);
}

export function createOrder() {
    return api.post("/orders/");
}