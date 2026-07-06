import CartItem from "./CartItem";

function CartList({cart, removeFromCart})
{
    return(
        <>
            <h2>CartList</h2>

            {cart.map(item => (

                <CartItem
                    key={item.id}
                    item={item}
                    removeFromCart={removeFromCart}
                />

            ))}
        </>
    );  
}

export default CartList;