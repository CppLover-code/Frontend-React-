import { api } from "./client";

export function getOrders(page = 1) {
    return api.get(`/orders/?page=${page}`);
}

export function createOrder() {
    return api.post("/orders/");
}

export function payOrder(id) {
    return api.post(`/orders/${id}/pay/`);
}

export function updateOrderStatus(id, status) {
    return api.post(`/orders/${id}/status/`, { status });
}