import CartList from "../components/CartList";

function Cart({cart}) 
{
    return (
        <>
            <CartList
                cart={cart}
            />
        </>
    );
}

export default Cart;