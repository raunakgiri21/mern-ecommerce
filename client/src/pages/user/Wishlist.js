import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import WishlistItem from "../../components/cards/WishlistItem";
import UserMenu from "../../components/nav/UserMenu";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button, Empty, Popconfirm } from "antd";

const Wishlist = () => {
    const [auth,setAuth] = useAuth();
    const [wishlist,setWishlist] = useState([]);
    const [change, setChange] = useState(false);

    useEffect(() => {
        loadWishlist();
    },[change])
    
    const loadWishlist = async() => {
        try {
            setWishlist([])
            const {data} = await axios.get(`/user/wishlist/${auth?.user?.userID}`)
            setWishlist(data)
        } catch (error) {
            console.log(error)
        }
    }

    const clearWishlistHandler = async() => {
        try {
            const {data} = await axios.put(`/user/wishlist-clear/${auth?.user?.userID}`)
            setChange(prev => !prev)
            toast.success("Wishlist Cleared!")
        } catch (error) {
            toast.error("Error while clearing your wishlist!")
            console.log(error)
        }
    }

    const html = wishlist?.length ? (<div className='row' style={{maxHeight: '90vh', overflow: 'auto', overflowX: 'hidden'}} id='id0'>
                                        {wishlist?.map((item,index) => 
                                        (<div className='col-md-4' key={index}>
                                            <WishlistItem item={item} key={item._id} setChange={setChange} _wishlist={wishlist}/>   
                                        </div>))}
                                    </div>)
                                    :
                                    (<div className="text-center">
                                        <Empty description={<span className="text-muted">Your Wishlist is Empty!</span>}/>
                                    </div>)
    return (
        <>
        <Jumbotron pageTitle={`Hello ${auth?.user?.name}`} pageSubtitle='Wishlist' />
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <UserMenu/>
                </div>
                <div className="col-md-9">
                    <div className="p-3 mt-2 mb-2 bg-light d-flex justify-content-between">
                        <h4>My Wishlist</h4>
                        {wishlist?.length ? <Popconfirm
                            placement="bottomRight"
                            title={"Do You Really Want To Clear The Wishlist?"}
                            onConfirm={clearWishlistHandler}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button>Clear All</Button>
                        </Popconfirm>: null}
                    </div>
                    <div className="row">
                        {html}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Wishlist