import Carousel from "../components/cards/Carousel"
import ProductCard from '../components/cards/ProductCard';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Checkbox, Radio, Slider, Input, Space, Empty } from 'antd';
import { useAuth } from "../context/auth";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [priceRange, setPriceRange] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('')
    const [availibilityCheck, setAvailabilityCheck] = useState(false)
    const [trigger, setTrigger] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [wishlist,setWishlist] = useState([]);

    const observer = useRef()
    const [auth,setAuth] = useAuth()
    const lastProductRef = useCallback(node => {
        if(loadingMore) return
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1)
                // console.log(page)
            }
        })
        if(node) observer.current.observe(node)
    },[loadingMore, hasMore])

    const loading = (<div className='text-center'>
                        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    </div>)

    useEffect(() => {
        loadProducts();
        loadWishlist();
    },[trigger, page]);
    useEffect(() => {
        loadCategories();
    },[])

    const loadCategories = async() => {
        try {
            const {data} = await axios.get('/category');
            setCategories(data);
        } catch (error) {
            console.log(error);
        }
    }

    const loadWishlist = async() => {
        try {
            const {data} = await axios.get(`/user/wishlist/${auth?.user?.userID}`)
            setWishlist(data)
        } catch (error) {
            console.log(error)
        }
    }

    const loadProducts = async() => {
        setLoadingMore(true)
        try {
            const queryStrings = {
                params: {
                    sort: sort+'-createdAt',
                }
            }
            if(page) {
                queryStrings.params['page'] = page;
            }
            if(availibilityCheck) {
                queryStrings.params['availability'] = availibilityCheck;
            }
            if(checked) {
                queryStrings.params['category'] = checked; 
            }
            if(priceRange[1]) {
                queryStrings.params['numericFilters'] = 'price>='+priceRange[0]+',price<='+priceRange[1];
            }
            if(search) {
                queryStrings.params['name'] = search;
            }
            // console.log(queryStrings)
            const {data} = await axios.get('/product',queryStrings);
            if(hasMore){
                setProducts((prevProducts) => {
                    if(!data.products.length){
                        // console.log('No more Prods');
                        setHasMore(false);
                    }
                    return [...new Set([...prevProducts,...data.products])]
                })
            }else{
                setPage(1)
                setProducts(data.products)
                setHasMore(true)
            }
            // console.log(data)
            setLoadingMore(false)
        } catch (error) {
            console.log(error);
        }
    }

    const handleCheck = async(value,id) => {
        let all = [...checked];
        if(value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id)  
        }
        setChecked(all)
        setHasMore(false)
        setTrigger(prevTrig => !prevTrig)
    }
    return (
        <div style={{overflowX : 'hidden'}}>
            <Carousel/>
            <div className='row'>
                <div className='col-md-3'>
                    <div className='container'>
                        <h2 className='p-3 mt-2 mb-2 h4 rounded text-center' style={{backgroundColor: '#ADD8E6'}}>
                            Filter By Categories
                        </h2>
                        <div className='row'>
                            {categories?.map(c => (
                                <Checkbox key={c._id} value={c._id} onChange={(e) => handleCheck(e.target.checked, c._id)}>{c.name}</Checkbox>
                            ))}
                        </div>
                    </div>
                    <hr/>
                    <div className='container'>
                        <h2 className='p-3 mt-2 mb-2 h4 rounded text-center' style={{backgroundColor: '#ADD8E6'}}>
                            Filter By Price & Availabilty
                        </h2>
                        <h6>Price Range:</h6>
                        <Slider range marks={{0: '₹0', 1000: '₹1000'}} min={0} max={1000} step={10} defaultValue={[0, 1000]} className='mx-3'
                        onChange={(e) => {
                            setPriceRange(e)
                        }}/>
                        <h6>Availabilty:</h6>
                        <Checkbox onChange={(e) => setAvailabilityCheck(!e.target.checked)} defaultChecked>Include Out of Stock</Checkbox>
                        <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
                        <button className='btn btn-outline-primary btn-sm' onClick={() => {
                            setHasMore(false)
                            setTrigger(prevTrig => !prevTrig)
                        }}>Apply</button>
                        </div>
                    </div>
                    <hr/>
                    <div className='container'>
                        <h2 className='p-3 mt-2 mb-2 h4 rounded text-center' style={{backgroundColor: '#ADD8E6'}}>
                            Sort
                        </h2>
                        <Radio.Group defaultValue={''} onChange={(e) => {
                            if(e.target.value === ''){
                                setSort('');
                            }else
                                setSort(e.target.value+',');   
                            setHasMore(false)     
                            setTrigger(prevTrig => !prevTrig)
                        }} >
                        <Space direction="vertical">
                            <Radio value={'price'}>Price Low to High</Radio>
                            <Radio value={'-price'}>Price High to Low</Radio>
                            <Radio value={''}>Recently Added</Radio>
                        </Space>
                        </Radio.Group>
                        
                    </div>
                </div>
                <div className='col-md-9'>
                    <div className='p-3 mt-2 mb-2 h4 rounded text-center' style={{backgroundColor: '#ADD8E6'}}>
                    <Input.Search placeholder="Search Product" enterButton onSearch={value => {
                        setSearch(value);
                        setHasMore(false)
                        setTrigger(prevTrig => !prevTrig)
                    }} />
                    </div>
                    <div className='row' style={{maxHeight: '90vh', overflow: 'auto', overflowX: 'hidden'}}>
                        {products?.map((p,index) =>{
                            if(products.length === index + 1)
                            return (
                                <div ref={lastProductRef} className='col-md-4' key={p._id}>
                                    <ProductCard p={p} _wishlist={wishlist}/>
                                </div>
                            )
                            return (
                            <div className='col-md-4' key={p._id}>
                                <ProductCard p={p} _wishlist={wishlist}/>
                            </div>
                        )})}
                        {hasMore || loadingMore ? loading : products.length ? <p>...</p> : <Empty />}
                    </div>
                </div>
            </div>
        </div>    
    )
}

export default Home