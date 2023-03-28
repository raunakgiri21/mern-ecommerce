import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import CartItem from "./CartItem";
import UserMenu from "../../components/nav/UserMenu";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Empty } from "antd";

const Cart = () => {
    const [auth,setAuth] = useAuth();
    const [cart,setCart] = useState([]);
    const [change, setChange] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        loadCart();
    },[change])

    const loadCart = async() => {
        try {
            const {data} = await axios.get(`/user/cart/${auth?.user?.userID}`)
            setCart(data)
        } catch (error) {
            console.log(error)
        }
    }

    const clearCartHandler = async() => {
        try {
            let answer = window.confirm("Do You Really Want To Clear The Cart?")
            if(!answer){
                return
            }
            const {data} = await axios.put(`/user/cart-clear/${auth?.user?.userID}`)
            setChange(prev => !prev)
            toast.success("Cart Cleared!")
        } catch (error) {
            toast.error("Error while clearing your cart!")
            console.log(error)
        }
    }
    return (
        <>
        <Jumbotron pageTitle={`Hello ${auth?.user?.name}`} pageSubtitle='Dashboard' />
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <UserMenu/>
                </div>
                <div className="col-md-9">
                    <div className="p-3 mt-2 mb-2 bg-light">
                        <h4>My Cart</h4>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            {cart.length?
                            <div className="overflowY-auto productsHeight" style={{overflowX: 'hidden'}} id='id0'>
                                {cart?.map((item,index) => 
                                (<CartItem item={item} key={item._id} setTotalPrice={setTotalPrice} setChange={setChange}/>))}   
                            </div>
                            :<div className="text-center">
                                <Empty description={<span className="text-muted">Your Cart is Empty!</span>}/>
                            </div>}
                        </div>
                        <div className="col-4">
                            <div className="container text-center p-5">
                                <h3>Cart Summary</h3>
                                <hr/>
                                <p className="text-dark">Total Items: {cart.length}</p>
                                <p><strong>Total Price: ₹{totalPrice}</strong></p>
                                <button className="btn btn-info mb-5" style={{maxHeight: '40px'}} onClick={() => console.log("CheckOut")} hidden={!cart.length}>Checkout</button>
                            </div>
                            <button className="btn btn-secondary mb-5" style={{maxHeight: '40px'}} onClick={clearCartHandler} hidden={!cart.length}>Clear Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Cart