import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders, payOrder, updateOrderStatus } from "../api/orders";
import useAuth from "../hooks/useAuth";
import useNotification from "../hooks/useNotification";
import useBook from "../hooks/useBook";

function OrdersPage() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);

    const { user } = useAuth();
    const { showNotification } = useNotification();
    const { refreshBooks } = useBook();

    useEffect(() => {
        let ignore = false;

        async function loadOrders() {
            try {
                const data = await getOrders(page);

                if (!ignore) {
                    setOrders(data.results);
                    setHasNext(Boolean(data.next));
                    setHasPrev(Boolean(data.previous));
                    setError(null);
                }
            } catch (err) {
                if (!ignore) setError(err);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadOrders();

        return () => {
            ignore = true;
        };
    }, [page]);

    function replaceOrder(updated) {
        setOrders((current) =>
            current.map((order) => (order.id === updated.id ? updated : order))
        );
    }

    async function handlePay(orderId) {
        try {
            const updated = await payOrder(orderId);
            replaceOrder(updated);
            showNotification({ message: "Payment successful", type: "success" });
        } catch {
            showNotification({ message: "Payment failed", type: "error" });
        }
    }

    async function handleStatus(orderId, status) {
        try {
            const updated = await updateOrderStatus(orderId, status);
            replaceOrder(updated);
            showNotification({ message: `Order ${status}`, type: "success" });
            if (status === "cancelled") {
                refreshBooks();
            }
        } catch {
            showNotification({ message: "Failed to update status", type: "error" });
        }
    }

    if (loading) return <p className="status-message">Loading...</p>;
    if (error) return <p className="status-error">Failed to load orders :(</p>;

    if (orders.length === 0) {
        return (
            <div className="card-surface p-8 text-center">
                <p className="font-heading text-[1.5em] text-ink dark:text-paper">You have no orders yet</p>
                <Link
                    to="/books"
                    className="link-accent mt-3 inline-block text-sm uppercase tracking-[0.12em]"
                >
                    Browse books
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="section-kicker">Purchases</p>
                <h1 className="page-title mt-1">
                    {user.is_staff ? "Orders" : "My Orders"}
                </h1>
                <span className="title-underline" />
            </div>

            {orders.map(order => (
                <article
                    key={order.id}
                    className="card-surface space-y-3 p-5"
                >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="font-heading text-[1.4em] text-ink dark:text-paper">
                            Order #{order.id}
                        </h2>
                        <span className="chip">
                            {order.status}
                        </span>
                    </div>

                    <p className="text-sm text-faint">
                        Placed: {new Date(order.created_at).toLocaleString()}
                    </p>

                    <ul className="divide-y divide-line text-sm text-muted dark:divide-night-border dark:text-faint">
                        {order.items.map(item => (
                            <li key={item.id} className="flex justify-between py-2">
                                <span>{item.book_title} × {item.quantity}</span>
                                <span>${Number(item.subtotal).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="text-right font-heading text-[1.3em] text-gold dark:text-accent">
                        Total: ${Number(order.total_price).toFixed(2)}
                    </p>

                    <p className="text-sm text-faint">
                        Ship to: {order.shipping_first_name} {order.shipping_last_name},{" "}
                        {order.shipping_street}, {order.shipping_city}{" "}
                        {order.shipping_postal_code}, {order.shipping_phone}
                    </p>

                    {!user.is_staff && order.status === "pending" && (
                        <button
                            type="button"
                            onClick={() => handlePay(order.id)}
                            className="btn-primary btn-sm"
                        >
                            Pay
                        </button>
                    )}

                    {user.is_staff && (
                        <div className="flex flex-wrap gap-2">
                            {order.status === "paid" && (
                                <button
                                    type="button"
                                    onClick={() => handleStatus(order.id, "shipped")}
                                    className="btn-primary btn-sm"
                                >
                                    Mark shipped
                                </button>
                            )}
                            {order.status === "shipped" && (
                                <button
                                    type="button"
                                    onClick={() => handleStatus(order.id, "delivered")}
                                    className="btn-primary btn-sm"
                                >
                                    Mark delivered
                                </button>
                            )}
                            {(order.status === "pending" || order.status === "paid") && (
                                <button
                                    type="button"
                                    onClick={() => handleStatus(order.id, "cancelled")}
                                    className="btn-danger-outline btn-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    )}
                </article>
            ))}

            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={!hasPrev}
                    className="btn-muted btn-sm"
                >
                    ← Prev
                </button>

                <span className="text-sm uppercase tracking-[0.12em] text-muted dark:text-faint">Page {page}</span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={!hasNext}
                    className="btn-muted btn-sm"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

export default OrdersPage;