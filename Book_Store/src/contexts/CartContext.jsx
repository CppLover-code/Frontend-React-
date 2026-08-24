import { createContext, useState, useEffect, useRef } from "react";
import * as cartApi from "../api/cart";
import * as ordersApi from "../api/orders";
import useAuth from "../hooks/useAuth";

const CartContext = createContext();

function CartProvider({ children }) {

    // корзина принадлежит пользователю, поэтому следим за авторизацией
    const { user } = useAuth();

    // null = корзина еще не загружена (или пользователь - аноним)
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Загружаем корзину, когда пользователь залогинился;
    // сбрасываем, когда разлогинился
    useEffect(() => {
        let ignore = false;

        if (!user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- reset cart on logout
            setCart(null);
            return;
        }

        async function loadCart() {
            setLoading(true);
            setError(null);

            try {
                const data = await cartApi.getCart();

                if (!ignore) setCart(data);
            } catch (err) {
                if (!ignore) setError(err);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadCart();

        return () => {
            ignore = true;
        };
    }, [user]);

    // --------------------------------------------------
    // Операции: каждая возвращает свежую корзину с сервера
    // --------------------------------------------------
    async function addToCart(book, quantity = 1) {
        const updatedCart = await cartApi.addToCart(book.id, quantity);
        setCart(updatedCart);
    }

    async function removeFromCart(itemId) {
        const updatedCart = await cartApi.removeCartItem(itemId);
        setCart(updatedCart);
    }

    // Количество меняем через delta-эндпоинт: сервер сам читает
    // текущее значение, поэтому нет гонки "read-modify-write".
    // Падение количества до нуля сервер трактует как удаление позиции.
    //
    // lastQuantityRequestId защищает от устаревших ответов: при двух
    // быстрых кликах состояние обновит только ответ на последний запрос
    // (каждый ответ содержит корзину целиком).
    const lastQuantityRequestId = useRef(0);

    async function changeQuantity(itemId, delta) {
        const requestId = ++lastQuantityRequestId.current;

        const updatedCart = await cartApi.changeCartItemQuantity(itemId, delta);

        if (requestId === lastQuantityRequestId.current) {
            setCart(updatedCart);
        }
    }

    function increaseQuantity(itemId) {
        return changeQuantity(itemId, 1);
    }

    function decreaseQuantity(itemId) {
        return changeQuantity(itemId, -1);
    }

    async function checkout() {
        const order = await ordersApi.createOrder();

        // сервер очистил корзину при создании заказа - забираем актуальное состояние
        const updatedCart = await cartApi.getCart();
        setCart(updatedCart);

        return order;
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,

                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                checkout,
            }}>

            {children}

        </CartContext.Provider>
    );
}

export { CartContext, CartProvider };