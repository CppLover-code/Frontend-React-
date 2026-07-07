import CartList from "../components/CartList";

function Cart({cart, removeFromCart, decreaseQuantity, increaseQuantity}) 
{
    const total = cart.reduce((acc, item) => {
        const {price, quantity} = item;
        return acc + price * quantity;
    }, 0);

    return (
        <>
            <CartList 
                    cart={cart} 
                    removeFromCart={removeFromCart}
                    decreaseQuantity={decreaseQuantity}
                    increaseQuantity={increaseQuantity}
                    />

            <p>Total: ${total.toFixed(2)}</p>
        </>
    );
}

export default Cart;