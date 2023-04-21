import { useState , useEffect} from "react"
import moment from "moment"
import OrderedProduct from "../../components/cards/OrderedProduct";


const SingleOrder = ({o,i}) => {
    const [down,setDown] = useState(true);

    return(
    <div className="border shadow bg-light rounded-4 mb-5">
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    {/* <th scope="col">Order ID</th> */}
                    <th scope="col">Status</th>
                    <th scope="col">Ordered</th>
                    <th scope="col">Payment</th>
                    <th scope="col">No. of Items</th>
                    <th scope="col">Total Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{i+1}</td>
                    {/* <td>{o?._id}</td> */}
                    <td>{o?.status}</td>
                    <td>{moment(o?.createdAt).fromNow()}</td>
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
            <dd className="col-sm-9">{o?.address}</dd>

            <dt className="col-sm-3">Phone Number :</dt>
            <dd className="col-sm-9">
                <p>{o?.phone}</p>
            </dd>
            </dl>
        </div>
    </div>
    )
}

export default SingleOrder