import { useState, useEffect } from "react"
import jumbotron from "../components/cards/jumbotron"
import Carousel from "../components/cards/Carousel"
import axios from 'axios'
import { useParams } from "react-router-dom"

const ProductView = () => {
    // state
    const [product, setProduct] = useState({});

    const params = useParams();
    // hooks
    useEffect(() => {
        console.log(params)
        if(params?.slug) loadProducts();
    } ,[params?.slug])

    const loadProducts = async() => {
        try {
            const {data} = await axios.get(`/product/${params.slug}`);
            setProduct(data);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <pre>{JSON.stringify(product,null,4)}</pre>
        </>
    )
}

export default ProductView