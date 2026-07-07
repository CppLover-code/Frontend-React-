import CartItem from "./CartItem";

function CartList({cart, removeFromCart, decreaseQuantity, increaseQuantity})
{
    return(
        <>
            <h2>CartList</h2>

            {cart.map(item => (

                <CartItem
                    key={item.id}
                    item={item}
                    removeFromCart={removeFromCart}
                    decreaseQuantity={decreaseQuantity}
                    increaseQuantity={increaseQuantity}
                />

            ))}
        </>
    );  
}

export default CartList;