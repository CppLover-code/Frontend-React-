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

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>Failed to load orders :(</h2>;

    if (orders.length === 0) {
        return (
            <>
                <h2>You have no orders yet</h2>
                <Link to="/books">Browse books</Link>
            </>
        );
    }

    return (
        <>
            <h1>My Orders</h1>

            {orders.map(order => (
                <article key={order.id}>

                    <h3>
                        Order #{order.id} — {order.status}
                    </h3>

                    <p>
                        Placed: {new Date(order.created_at).toLocaleString()}
                    </p>

                    <ul>
                        {order.items.map(item => (
                            <li key={item.id}>
                                {item.book_title} × {item.quantity} — $
                                {Number(item.subtotal).toFixed(2)}
                            </li>
                        ))}
                    </ul>

                    <p>
                        <strong>
                            Total: ${Number(order.total_price).toFixed(2)}
                        </strong>
                    </p>

                </article>
            ))}

            <div className="pagination">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={!hasPrev}
                >
                    ← Prev
                </button>

                <span> Page {page} </span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={!hasNext}
                >
                    Next →
                </button>
            </div>
        </>
    );
}

export default OrdersPage;