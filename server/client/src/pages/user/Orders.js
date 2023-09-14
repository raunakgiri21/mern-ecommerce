import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import UserMenu from "../../components/nav/UserMenu";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Empty, Spin } from "antd";
import { useEffect, useState } from "react";
import SingleOrder from "../../components/cards/SingleOrder";

const Orders = () => {
    // context
    const [auth,setAuth] = useAuth();
    // state
    const [orders,setOrders] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        if(auth?.token) getUserOrders();
    },[auth?.token])

    const getUserOrders = async() => {
        try {
            const {data} = await axios.post("/order",{userID: auth?.user?.userID})
            const _orders = data.filter(d => d.success)
            setOrders(_orders)
            setLoading(false)
        } catch (error) {
            toast.error("Error fetching order details!")
        }
    }

    return (
        <>
        <Jumbotron pageTitle={`Hello ${auth?.user?.name}`} pageSubtitle='Order History' />
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <UserMenu/>
                </div>
                <div className="col-md-9">
                    <div className="p-3 mt-2 mb-2 bg-light">
                        <h4>Order History</h4>
                    </div>
                    {
                        loading?
                        <div className="h-100 d-flex align-items-center justify-content-center" >
                            <Spin size='large'/>
                        </div>:
                        !orders.length?
                        <Empty description="No Orders"/>:
                        <div className="row p-3" style={{height: '52vh',overflowY: 'auto'}}>
                            {orders?.map((o,i) => <SingleOrder key={o._id} i={i} o={o}/>)}
                        </div>
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default Orders