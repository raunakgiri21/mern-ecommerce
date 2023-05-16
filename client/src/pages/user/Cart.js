import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import CartItem from "../../components/cards/CartItem";
import UserMenu from "../../components/nav/UserMenu";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Empty, Spin } from "antd";
import { Form, Input, Modal, Radio, Space } from 'antd';

const Cart = () => {
    const [auth,setAuth] = useAuth();
    const [cart,setCart] = useState([]);
    const [change, setChange] = useState(false);
    const [address,setAddress] = useState(auth?.user?.address)

    const [state,setState] = useState('')
    const [city,setCity] = useState('')
    const [pincode,setPincode] = useState('')
    const [phoneNumber,setPhoneNumber] = useState('')
    const [street01,setStreet01] = useState('')
    const [street02,setStreet02] = useState('')

    const [totalPrice, setTotalPrice] = useState(0);

    const [active, setActive] = useState(false);
    const [radio, setradio] = useState(1)

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

    const modalHandler = async() => {
        try {
            setActive(prev => !prev)
        } catch (error) {
            toast.error("Error while checkout")
            console.log(error)
        }
    }

    const loadAddress = async(val) => {
        try {
            setradio(val)
        } catch (error) {
            toast.error("Error while selecting address!")
        }
    }

    const confirmHandler = async() => {
        try {
            let isNewAddress = true;
            const _address = {
                state: state,city: city,pinCode: pincode,street1: street01,street2: street02,phone: phoneNumber
            }
            if(radio !== 1){
                isNewAddress = false
                _address.state = address[radio-2]?.state;
                _address.city = address[radio-2]?.city;
                _address.pinCode = address[radio-2]?.pinCode;
                _address.phone = address[radio-2]?.phone;
                _address.street1 = address[radio-2]?.street1;
                _address.street2 = address[radio-2]?.street2;
            } else {
                if(!state || !city || !pincode || !state || !street01 || !phoneNumber){
                    return toast.error("Fields cannot be empty!")
                }
            }
            if(isNewAddress) {
                setAuth({...auth,user: {
                    ...auth.user, address: auth?.user?.address?.push(_address)
                } }) 
            }         
            const {data:{key}} = await axios.get('/razorpay-key')
            const {data:{order}} = await axios.post('/checkout/razor-pay',{amount: Number(totalPrice),cart: cart, buyer: auth?.user?.userID, email: auth?.user?.email, address: _address, isNewAddress: isNewAddress})

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
                    contact: _address?.phone,
                },
                notes: {},
                theme: {
                    color: "#2282A0"
                }
            };
            setActive(false)
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
                                :
                                <div className="text-center">
                                    <Empty description={<span className="text-muted">Your Cart is Empty!</span>}/>
                                </div>}
                                <Modal
                                    title="DELIVERY ADDRESS"
                                    centered
                                    open={active}
                                    onOk={() => setActive(false)}
                                    onCancel={() => setActive(false)}
                                    footer={[
                                        <button key="back" className="btn btn-secondary m-2 " onClick={modalHandler}>
                                          Cancel
                                        </button>,
                                        <button key="submit" type="primary" className="btn btn-info m-2" onClick={confirmHandler}>
                                          Confirm
                                        </button>,
                                    ]}
                                    width={1000}
                                >
                                    <Radio.Group value={radio} onChange={(e) => loadAddress(e.target.value)} className="m-3 mb-5">
                                    <Space direction="vertical">
                                        {address?.map((a,i) => <Radio value={i+2}>{a?.pinCode} / {a?.city} / {a?.street1.substring(0,40)} - Ph.No.{a?.phone}</Radio>
                                        )}
                                        <Radio value={1}>New Address</Radio>
                                    </Space>
                                    </Radio.Group>
                                    
                                    <Form name="" layout="basic" hidden={radio !== 1}>
                                    <Form.Item>
                                        <Form.Item
                                            name="state"
                                            label="State"
                                            style={{
                                                display: 'inline-block',
                                                marginRight: '2rem',
                                                marginBottom: 0
                                            }}
                                            >
                                            <Input placeholder="State" onChange={(e) => setState(e.target.value)}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="City"
                                            name="city"
                                            style={{
                                                display: 'inline-block',
                                                marginRight: '2rem',
                                                marginBottom: 0
                                            }}
                                            >
                                            <Input placeholder="City" onChange={(e) => setCity(e.target.value)}/>
                                        </Form.Item>

                                    </Form.Item>
                                    <Form.Item>
                                        <Form.Item
                                            label="Pincode"
                                            name="pincode"
                                            style={{
                                                display: 'inline-block',
                                                marginRight: '2rem',
                                                marginBottom: 0
                                            }}
                                            >
                                            <Input placeholder="Pincode" onChange={(e) => setPincode(e.target.value)}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Ph. no."
                                            name="PhoneNumber"
                                            style={{
                                                display: 'inline-block',
                                                marginRight: '2rem',
                                                marginBottom: 0
                                            }}
                                            >
                                            <Input placeholder="Phone Number" onChange={(e) => setPhoneNumber(e.target.value)}/>
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item
                                        label="Street-1"
                                        name="street1"
                                        style={{
                                            marginRight: '2rem',
                                            marginTop: 0,
                                            width: "600px"
                                        }}
                                    >
                                        <Input placeholder="Street/Road" onChange={(e) => setStreet01(e.target.value)}/>
                                    </Form.Item>
                                    <Form.Item
                                        label="Street-2"
                                        name="street2"
                                        style={{
                                            marginRight: '2rem',
                                            marginTop: 0,
                                            marginBottom: 0,
                                            width: "600px"
                                        }}
                                    >
                                        <Input placeholder="Street/Road" onChange={(e) => setStreet02(e.target.value)}/>
                                    </Form.Item>
                                    </Form>
                                </Modal>
                        </div>
                        <div className="col-4">
                            <div className="container text-center p-5">
                                <h3>Cart Summary</h3>
                                <hr/>
                                <p className="text-dark">Total Items: {cart.length}</p>
                                <p><strong>Total Price: ₹{totalPrice}</strong></p>
                                <button className="btn btn-info mb-5" style={{maxHeight: '40px'}} onClick={modalHandler} hidden={!cart.length}>Checkout</button>
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