import { api } from "./client";

export function getOrders() {
    return api.get("/orders/");
}

export function createOrder() {
    return api.post("/orders/");
}