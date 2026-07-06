import CartItem from "./CartItem";

function CartList({cart})
{
    return(
        <>
            <h2>CartList</h2>

            {cart.map(item => (

                <CartItem
                    key={item.id}
                    item={item}
                />
                
            ))}
        </>
    );  
}

export default CartList;