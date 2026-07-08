import { createContext } from "react";

const CartContext = createContext();

// children здесь — это не данные корзины, 
// а те компоненты, которым мы хотим дать доступ к корзине
function CartProvider({children})
{

}

export { CartContext, CartProvider };