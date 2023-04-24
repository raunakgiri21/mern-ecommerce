import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import CartItem from "../../components/cards/CartItem";
import UserMenu from "../../components/nav/UserMenu";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Empty } from "antd";
import { Form, Input } from 'antd';

const Cart = () => {
    const [auth,setAuth] = useAuth();
    const [cart,setCart] = useState([]);
    const [change, setChange] = useState(false);
    const [address,setAddress] = useState(auth?.user?.address)
    const [phone,setPhone] = useState(auth?.user?.phone)
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        loadCart()
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
            const {data} = await axios.put(`/user/cart-clear/${auth?.user?.userID}`)
            setChange(prev => !prev)
            toast.success("Cart Cleared!")
        } catch (error) {
            toast.error("Error while clearing your cart!")
            console.log(error)
        }
    }

    const checkoutHandler = async() => {
        try {
            const {data:{key}} = await axios.get('http://localhost:8000/api/v1/razorpay-key')
            const {data:{order}} = await axios.post('http://localhost:8000/api/v1/checkout/razor-pay',{amount: Number(totalPrice),cart: cart, address: address, phone: phone, buyer: auth?.user?.userID, email: auth?.user?.email})

            const options = {
                key: key, // Enter the Key ID generated from the Dashboard
                amount: order.amount,
                currency: "INR",
                name: "FOODSTRAP",
                description: "Test Transaction",
                image: "https://example.com/your_logo",
                order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                callback_url: "http://localhost:8000/api/v1/checkout/payment-verification",
                prefill: {
                    name: auth?.user?.name,
                    email: auth?.user?.email,
                    address: address,
                    contact: phone
                },
                notes: {},
                theme: {
                    color: "#2282A0"
                }
            };
            const razor = new window.Razorpay(options);
            razor.open()
        } catch (error) {
            toast.error("Error while opening razorpay!")
            console.log(error)
        }
    }
             
    return (
        <>
        <Jumbotron pageTitle={`Hello ${auth?.user?.name}`} pageSubtitle='Cart' />
        
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
                                <div hidden={!cart.length}>
                                <Form
                                    name="basic"
                                    labelCol={{
                                    span: 8,
                                    }}
                                    wrapperCol={{
                                    span: 16,
                                    }}
                                    style={{
                                    maxWidth: 600,
                                    }}
                                    initialValues={{
                                    address: address,
                                    phone: phone,
                                    }}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                    label="Address"
                                    name="address"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Please input your address!',
                                        },
                                    ]}
                                    >
                                    <Input onChange={(e) => setAddress(e.target.value)}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="phone"
                                        label="Phone"
                                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                                    >
                                        <Input addonBefore={"+91"} style={{ width: '100%'}} maxLength={10} minLength={10} onChange={(e) => setPhone(e.target.value)}/>
                                    </Form.Item>
                                </Form>
                                </div>
                                <button className="btn btn-info mb-5" style={{maxHeight: '40px'}} onClick={checkoutHandler} hidden={!cart.length} disabled={!address || !phone || phone?.length<10}>Checkout</button>
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