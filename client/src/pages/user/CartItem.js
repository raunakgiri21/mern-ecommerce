import { useState, useEffect } from 'react'
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CartItem = ({item, setTotalPrice, setChange}) => {
    const [product, setProduct] = useState({});
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        loadProduct();
    },[])

    const loadProduct = async() => {
        try {
            const {data} = await axios.get(`product/productID/${item.productID}`)
            setProduct(data)
            setTotalPrice(prevPrice => prevPrice+data.price*item.quantity);
        } catch (error) {
            console.log(error)
        }
    }

    const removeItemHandler = async() => {
        try {
            const {data} = await axios.put(`user/cart/removeItem/${auth.user.userID}/${item._id}`)
            setTotalPrice(prevPrice => prevPrice-product.price*item.quantity)
            toast.success('removed')
            setChange(prevChange => !prevChange)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='card mt-1 rounded'>
            <div className='row' style={{maxHeight: '12rem'}}>
                <div className='col-4'>
                    <img src={`data:${product.image?.contentType};base64,${product.image?.imageBase64}`} alt='product image' style={{ height: "10rem", width: '100%', objectFit: 'contain'}}/>
                </div>
                <div className='col-8 p-4'>
                    <div className='d-flex justify-content-between'>
                        <div className='details'>
                            <h5>{product.name}</h5>
                            <p className='text-muted'>Quantity: {item.quantity}</p>
                            <p className='text-info'>Price: ₹{product.price}</p>
                        </div>
                        <button className="btn btn-danger mb-5" style={{maxHeight: '40px'}} onClick={removeItemHandler}>Delete</button>
                    </div>
                </div>
            </div>
            <></>
        </div>                      
    )
}

export default CartItem