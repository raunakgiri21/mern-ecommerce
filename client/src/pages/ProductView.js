import { useState, useEffect } from "react"
import ProductCard from "../components/cards/ProductCard"

import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams } from "react-router-dom"

const ProductView = () => {
    // slider settings
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ],
      };

    // state
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const params = useParams();
    // hooks
    useEffect(() => {
        if(params?.slug) loadProduct().then((cat,pid) => {
            loadRelatedProducts(cat,pid)
        });
    } ,[params?.slug])
    
    const loadProduct = async() => {
        try {
            setLoading(true)
            const {data} = await axios.get(`/product/${params.slug}`);
            setProduct(data);
            return {cat: data?.category?._id, pid: data?._id};
        } catch (error) {
            toast.error('Loading Failed!')
            console.log(error)
        }
        return null;
    }
    
    const loadRelatedProducts = async({cat,pid}) => {
        try {
            const queryStrings = {
                params: {
                    sort: '-createdAt',
                    category: cat,
                }
            }
            const {data} = await axios.get('/product',queryStrings)
            const res = data.products;
            setRelatedProducts(res.filter((p) => (p._id !== pid && p.availability)))
            setLoading(false)
        } catch (error) {
            console.log(error)
            toast.error("Failed loading related products!")
        }
    }

    const Spinner = (<div className='text-center'>
                        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    </div>)

    return (
        <> {!loading?
            <>
            <div className="row m-5 bg-white rounded">
                <div className="col-6 text-center">
                    <img src={`data:${product.image?.contentType};base64,${product.image?.imageBase64}`} alt={product.name}/>
                </div>
                <div className="col-6">
                    <div className="card-body m-5">
                        <h2>{product.name}</h2>
                        <hr/>
                        <div className="d-flex justify-content-between">
                            <h4 className='fw-bold'>
                                Price: {product.price.toLocaleString('en-IN',{
                                    style: 'currency',
                                    currency: 'INR'
                                })}
                            </h4>
                            {product.availability?product.quantity <= 10 ? <p className="text-warning">Only a few left!</p> : <p className="text-success">In-Stock</p> : <p className="text-danger fw-bold">Currently Out of Stock</p>}
                        </div>
                        <h6>Category: {product.category.name}</h6>
                        <p className="card-text">
                            {product.description}
                        </p>
                        <div class="input-group mb-3" style={{width: '20rem'}}  hidden={!product.quantity}>
                            <div class="input-group-prepend">
                                <span class="input-group-text">Quantity</span>
                            </div>
                            <input type="number" min='1' max='20' class="form-control rounded" aria-label="quantity" value={orderQuantity}
                            onChange={(e) => setOrderQuantity(e.target.value)}/> 
                        </div>
                    <button type="button" class="btn btn-order" hidden={!product.quantity}>Add to Cart</button>
                    </div>
                </div>
            </div>
            <div className="row m-5">
                <h2>Related Products</h2>
                <Slider {...settings}>
                    {relatedProducts?.map((p,index) =>{
                        return (
                        <div className='p-2' key={p._id}>
                            <ProductCard p={p}/>
                        </div>
                    )})}
                </Slider>
            </div>
            </>
            :
            <>{Spinner}</>
            }
        </>
    )
}

export default ProductView