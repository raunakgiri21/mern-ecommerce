import { useState , useEffect} from "react"
import moment from "moment"
import axios from "axios";
import { Select } from "antd";
import OrderedProduct from "../../components/cards/OrderedProduct";
import { toast } from "react-hot-toast";


const SingleOrder = ({o,i}) => {
    const [down,setDown] = useState(true);
    const [buyer,setBuyer] = useState("");
    const [status,setStatus] = useState(o?.status)

    useEffect(() => {
        loadUser()
    },[])

    const loadUser = async() => {
        try {
            const {data} = await axios.get(`auth/user-details/${o?.buyer}`)
            setBuyer(data?.user?.name)
        } catch (error) {
            console.log(error)
        }
    }

    const updateOrder = async(e) => {
        try {
            const {data} = await axios.put(`order/update-order`,{status: e,orderID: o?._id})
            toast.success("Updated order!")
        } catch (error) {
            console.log(error)
            toast.error("Unable to update!")
        }
    }

    return(
    <div className="border shadow bg-light rounded-4 mb-5">
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    {/* <th scope="col">Order ID</th> */}
                    <th scope="col">Status</th>
                    <th scope="col">Ordered</th>
                    <th scope="col">Buyer</th>
                    <th scope="col">Payment</th>
                    <th scope="col">No. of Items</th>
                    <th scope="col">Total Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{i+1}</td>
                    {/* <td>{o?._id}</td> */}
                    <td>
                        <Select defaultValue={o?.status} onChange={e => {
                            setStatus(e)
                            updateOrder(e)
                        }}>
                            <Select.Option value="Not processed">Not Processed</Select.Option>
                            <Select.Option value="Processing">Processing</Select.Option>
                            <Select.Option value="Shipped">Shipped</Select.Option>
                            <Select.Option value="Delivered">Delivered</Select.Option>
                            <Select.Option value="Cancelled">Cancelled</Select.Option>
                        </Select>
                    </td>
                    <td>{moment(o?.createdAt).fromNow()}</td>
                    <td>{buyer}</td>
                    <td className="text-success">Done</td>
                    <td>{o?.products?.length} items</td>
                    <td>₹ {o?.amount/100}</td>
                    <td>
                    <i className={`fas fa-caret-${down? 'down': 'up'}`} style={{fontSize:"28px", color: "#1284b4", cursor: "pointer"}} onClick={() => setDown(prev => !prev)}></i>
                    </td>
                </tr>
            </tbody>
        </table>
        {o?.products?.map((p,i) => (
        <OrderedProduct key={p._id} pID={p.productID} quantity={p.quantity} hidden={down}/>))}
        <div className="p-2 pb-0 text-muted">
            <dl className="row m-0">
            <dt className="col-sm-3">Delivery Address :</dt>
            <dd className="col-sm-9">{o?.address?.street1}, {o?.address?.city}, {o?.address?.pinCode}</dd>

            <dt className="col-sm-3">Contact Number :</dt>
            <dd className="col-sm-9">
                <p>{o?.address?.phone}</p>
            </dd>
            </dl>
        </div>
    </div>
    )
}

export default SingleOrder