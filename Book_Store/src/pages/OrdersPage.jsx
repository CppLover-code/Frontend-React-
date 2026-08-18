import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/orders";

function OrdersPage() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function loadOrders() {
            setLoading(true);

            try {
                const data = await getOrders(page);

                if (!ignore) {
                    setOrders(data.results);
                    setHasNext(Boolean(data.next));
                    setHasPrev(Boolean(data.previous));
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

    if (loading) return <p className="py-12 text-center text-gray-500">Loading...</p>;
    if (error) return <p className="py-12 text-center text-red-600">Failed to load orders :(</p>;

    if (orders.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-medium text-gray-900">You have no orders yet</p>
                <Link
                    to="/books"
                    className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline"
                >
                    Browse books
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

            {orders.map(order => (
                <article
                    key={order.id}
                    className="space-y-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                        </h2>
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium capitalize text-teal-700">
                            {order.status}
                        </span>
                    </div>

                    <p className="text-sm text-gray-500">
                        Placed: {new Date(order.created_at).toLocaleString()}
                    </p>

                    <ul className="divide-y divide-gray-100 text-sm text-gray-700">
                        {order.items.map(item => (
                            <li key={item.id} className="flex justify-between py-2">
                                <span>{item.book_title} × {item.quantity}</span>
                                <span>${Number(item.subtotal).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="text-right font-bold text-gray-900">
                        Total: ${Number(order.total_price).toFixed(2)}
                    </p>
                </article>
            ))}

            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={!hasPrev}
                    className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    ← Prev
                </button>

                <span className="text-sm text-gray-600">Page {page}</span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={!hasNext}
                    className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

export default OrdersPage;