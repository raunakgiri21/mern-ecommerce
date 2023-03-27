import moment from 'moment';
import { Badge } from 'antd';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth';
import { toast } from 'react-hot-toast';
import axios from 'axios';


const ProductCard = ({p}) => {
    const [auth,setAuth] = useAuth();
    const navigate = useNavigate();

    const addToCart = async() => {
        try {
            if(!auth.user){
                return toast.error('Login to access your Cart!')
            }
            if(!p.quantity){
                return toast.error(`${p.name} is Out of Stock!`)
            }
            const {data} = await axios.post(`/user/cart/${auth?.user?.userID}`,{productID: p._id ,quantity: 1})
            toast.success(`${p.name} added to cart`)
        } catch (error) {
            console.log(error)
            toast.error("error adding to cart")
        }
    }
    return(
        <div className="card mb-3 mt-2 hoverable" style={{maxWidth: '28rem', cursor: 'default'}}>
            <Badge.Ribbon text={`${p.availability ? 'In stock' : 'Out of stock'}`} placement='start' color={`${p.availability ? 'cyan' : 'volcano'}`}>
                <img src={`data:${p.image?.contentType};base64,${p.image?.imageBase64}`} 
                alt='Product Image'
                style={{ height: "250px", width: '100%', objectFit: 'contain'}}/>
            </Badge.Ribbon>
            <div className="card-body border-top border-light bg-light rounded" style={{minHeight: '11rem'}}>
                <h5>{p.name}</h5>
                <h4 className='fw-bold'>
                    {p.price.toLocaleString('en-IN',{
                        style: 'currency',
                        currency: 'INR'
                    })}
                </h4>
                <p className="card-text">
                    {p.description.substring(0,50)}...
                </p>
                <small className='text-muted'>Listed: {moment(p.createdAt).fromNow()}</small>
            </div>
            <div className='d-flex justify-content-between'>
                <button className='btn btn-primary col card-button' style={{borderBottomLeftRadius: '5px'}}
                onClick={() => navigate(`/product/${p.slug}`)}>
                    View
                </button>
                <button className='btn btn-outline-primary col card-button' disabled={!p.quantity} style={{borderBottomRightRadius: '5px'}}
                onClick={addToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard