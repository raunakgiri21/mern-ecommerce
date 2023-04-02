import moment from 'moment';
import { Badge } from 'antd';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import axios from 'axios';


const WishlistItem = ({item,setChange,_wishlist}) => {
    const [auth,setAuth] = useAuth();
    const [inWishlist,setInWishlist] = useState(false)
    const [product, setProduct] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        loadProduct();
    },[])
    
    const loadProduct = async() => {
        try {
            const {data} = await axios.get(`product/productID/${item}`)
            setInWishlist(_wishlist?.includes(data._id))
            setProduct(data)
        } catch (error) {
            console.log(error)
        }
    }

    const addToCart = async() => {
        try {
            if(!auth.user){
                return toast.error('Login to access your Cart!')
            }
            if(!product.quantity){
                return toast.error(`${product.name} is Out of Stock!`)
            }
            const {data} = await axios.post(`/user/cart/${auth?.user?.userID}`,{productID: product._id ,quantity: 1})
            toast.success(`${product.name} added to cart`)
        } catch (error) {
            console.log(error)
            toast.error("error adding to cart")
        }
    }

    const toggleInWishlist = async() => {
        try {
            if(!auth.user){
                return toast.error('Login to access your Wishlist!')
            }
            if(!inWishlist){
                const {data} = await axios.put(`/user/wishlist/${auth?.user?.userID}`,{productID: product._id})
                setInWishlist(true)
            }else{
                const {data} = await axios.put(`/user/wishlist/removeItem/${auth?.user?.userID}/${product._id}`)
                setInWishlist(false)
            }
            setChange(prev => !prev)
        } catch (error) {
            console.log(error)
            toast.error("error updating to wishlist")
        }
    }
    return(
        <div className="card mb-3 mt-2 hoverable" style={{maxWidth: '28rem', cursor: 'default'}}>
            <Badge.Ribbon text={`${product.availability ? 'In stock' : 'Out of stock'}`} placement='start' color={`${product.availability ? 'cyan' : 'volcano'}`}>
                <img src={`data:${product.image?.contentType};base64,${product.image?.imageBase64}`} 
                alt='Product Image'
                style={{ height: "250px", width: '100%', objectFit: 'contain'}}/>
            </Badge.Ribbon>
            <div className='heart' style={{position: 'absolute', top: '10px',right: '10px'}}>
                <i className={`fa${inWishlist?'s':'r'} fa-heart`} style={{fontSize: '32px', color: 'red', cursor: 'pointer'}} onClick={toggleInWishlist}></i>
            </div>
            <div className="card-body border-top border-light bg-light rounded" style={{minHeight: '11rem'}}>
                <h5>{product.name}</h5>
                <h4 className='fw-bold'>
                    {product.price?.toLocaleString('en-IN',{
                        style: 'currency',
                        currency: 'INR'
                    })}
                </h4>
                <p className="card-text">
                    {product.description?.substring(0,50)}...
                </p>
                <small className='text-muted'>Listed: {moment(product.createdAt).fromNow()}</small>
            </div>
            <div className='d-flex justify-content-between'>
                <button className='btn btn-primary col card-button' style={{borderBottomLeftRadius: '5px'}}
                onClick={() => navigate(`/product/${product.slug}`)}>
                    View
                </button>
                <button className='btn btn-outline-primary col card-button' disabled={!product.quantity} style={{borderBottomRightRadius: '5px'}}
                onClick={addToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default WishlistItem