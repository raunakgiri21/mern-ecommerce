import { useAuth } from "../../context/auth"
import { useState, useEffect } from "react";
import Jumbotron from "../../components/cards/jumbotron"
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pagination, Spin } from "antd";

const AdminProducts = () => {
    // context
    const [auth,setAuth] = useAuth();
    // state
    const [products, setProducts] = useState([]);
    const [totalLength, setTotalLength] = useState(0);
    const [page,setPage] = useState(1);
    const [load, setLoad] = useState(false)

    useEffect(() => {
        loadProducts();
    }, [page]);

    useEffect(() => {
        getTotalLength();
    },[])

    const getTotalLength = async() => {
        try {
            const {data} = await axios.get('/product/length');
            setTotalLength(Number(data));
        } catch (error) {
            console.log(error)
        }
    }
    
    const loadProducts = async() => {
        try {
            const queryStrings = {
                params: {
                    page: page,
                    limit: 10,
                }
            }
            setLoad(true)
            const {data} = await axios.get('/product',queryStrings)
            setProducts(data.products)
            setLoad(false)
            // console.log(products)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
        <Jumbotron pageTitle={`Hello ${auth?.user?.name}`} pageSubtitle='Admin Dashboard' />
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu/>
                </div>
                <div className="col-md-9">
                    <div className="p-3 mt-2 mb-2 bg-light rounded">
                        <h4>Products</h4>
                    </div>
                    {load 
                    ? 
                    <div className="h-100 d-flex align-items-center justify-content-center" >
                        <Spin size='large'/>
                    </div>
                    : 
                    <div className="overflow-auto productsHeight" id='id0'>
                        {products?.map((p,index) => 
                        (<Link className="text-decoration-none text-dark" id={`id-${index}`} key={p._id} to={`/dashboard/admin/product/update/${p.slug}`}>
                            <div className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <img src={`data:${p?.image?.contentType};base64,${p.image?.imageBase64}`} alt={p.name}
                                        className="img-fluid rounded-start"/>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p?.description?.substring(0,160)}</p>
                                            <div className="card-text"><small className="text-muted">{p.createdAt}</small></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>))}
                            <Pagination defaultCurrent={page} total={totalLength} onChange={(page) => {
                                setPage(page);
                            }}/>
                    </div>}
                </div>
            </div>
        </div>
        </>
    )
}

export default AdminProducts