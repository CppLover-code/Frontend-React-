import { createContext, useState, useEffect } from "react";
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

    async function increaseQuantity(itemId) {
        const item = cart.items.find(item => item.id === itemId);

        if (!item) return;

        const updatedCart = await cartApi.updateCartItem(itemId, item.quantity + 1);
        setCart(updatedCart);
    }

    async function decreaseQuantity(itemId) {
        const item = cart.items.find(item => item.id === itemId);

        if (!item) return;

        // количество 1 и минус - значит, убрать позицию
        if (item.quantity === 1) {
            return removeFromCart(itemId);
        }

        const updatedCart = await cartApi.updateCartItem(itemId, item.quantity - 1);
        setCart(updatedCart);
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