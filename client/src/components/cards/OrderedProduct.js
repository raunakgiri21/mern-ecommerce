import { useState , useEffect} from "react"
import axios from "axios"
import { Link } from "react-router-dom"


const OrderedProduct = ({pID,quantity,hidden}) => {
    // state
    const [product,setProduct] = useState({})

    useEffect(() => {
        loadProduct()
    },[])

    const loadProduct = async() => {
        try {
            const {data} = await axios.get(`product/productID/${pID}`)
            setProduct(data)
        } catch (error) {
            console.log(error)
        }
    }   

    return(
        <Link className="text-decoration-none text-dark" to={`/product/${product.slug}`} hidden={hidden}>
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-4" style={{maxHeight: "150px"}}>
                        <img src={`data:${product?.image?.contentType};base64,${product.image?.imageBase64}`} alt={product.name}
                        className="img-fluid rounded-start" style={{height: "100%",width: "100%",objectFit: "contain"}}/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">{product.name}</h5>
                            <div className="card-text"><small className="text-muted">Quantity: {quantity}</small></div>
                            <div className="card-text"><small className="text-muted">Price per quantity: ₹{product.price}</small></div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default OrderedProduct