import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import UserMenu from "../../components/nav/UserMenu";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import SingleOrder from "../../components/cards/SingleOrder";

const Orders = () => {
    // context
    const [auth,setAuth] = useAuth();
    // state
    const [orders,setOrders] = useState([]);

    useEffect(() => {
        if(auth?.token) getUserOrders();
    },[auth?.token])

    const getUserOrders = async() => {
        try {
            const {data} = await axios.post("/order",{userID: auth?.user?.userID})
            setOrders(data)
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
                    <div className="row p-3 overflowY-auto mh-100">
                        {orders?.map((o,i) => <SingleOrder key={o._id} i={i} o={o}/>)}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Orders