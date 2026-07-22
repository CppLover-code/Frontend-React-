import { createContext, useState, useEffect } from "react";

const CartContext = createContext();

// children здесь — это не данные корзины, 
// а те компоненты, которым мы хотим дать доступ к корзине
// <CartContext.Provider> Это специальный компонент, который React автоматически создаёт после вызова createContext();
// Через prop value Provider передает данные всем компонентам внутри {children}.
function CartProvider({ children }) {

    const [cart, setCart] = useState(() => {
    
        const savedCart = localStorage.getItem("cart");
    
        if(savedCart) return JSON.parse(savedCart);
    
        return [];
    
      });

    // Каждый раз, когда меняется cart,
    // корзина сохраняется в localStorage.
      useEffect(() => {
    
        localStorage.setItem(
          "cart",
          JSON.stringify(cart)
        );
    
      }, [cart]);

    function addToCart(book) {

        const existingBook = cart.find(item => item.id === book.id);

        if (!existingBook) {
            setCart([...cart, { ...book, quantity: 1 }]);

            return;
        }

        setCart(
            cart.map(item => {
                if (item.id === book.id) {
                    return {
                        ...item,
                        quantity: item.quantity + 1
                    }
                }

                return item;
            })
        );
    }

    function removeFromCart(id) {
        setCart(cart.filter(item => item.id !== id));
    }

    function decreaseQuantity(id) {
        const decItem = cart.find(item => item.id === id)

        if (!decItem) return;

        if (decItem.quantity === 1) {
            removeFromCart(decItem.id);
            return;
        }

        setCart(
            cart.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        quantity: item.quantity - 1
                    }
                }

                return item;
            })
        );
    }

    function increaseQuantity(id) {
        setCart(
            cart.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        quantity: item.quantity + 1
                    }
                }

                return item;
            })
        );
    }
    return (
        <CartContext.Provider value={
                {cart,
                addToCart,
                removeFromCart,
                decreaseQuantity,
                increaseQuantity}
            }>

            {children}

        </CartContext.Provider>
    );
}

export { CartContext, CartProvider };