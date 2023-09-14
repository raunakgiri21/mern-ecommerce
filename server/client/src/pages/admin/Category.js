import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import AdminMenu from "../../components/nav/AdminMenu";
import Modal from "../../components/cards/modal";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminCategory = () => {
    // context
    const [auth,setAuth] = useAuth();
    // state
    const [name,setName] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    },[])

    // useEffect(() => {
    //     loadCategories();
    // },[modal])

    const loadCategories = async() => {
        try {
            const {data} = await axios.get('/category');
            setCategories(data);
        } catch (error) {
            toast.error(error.response.data.error)
        }
    }
    const submitButtonHandler = async(e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post('/category',{name});
            if(data?.error){
                toast.error(data.error)
            }else {
                setName('')
                loadCategories();
                toast.success(`"${data.name}" category is created!`)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.error)
        }
    }

    const nameChangeHandler = (e) => {
        e.preventDefault();
        setName(e.target.value);
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
                    <h4>Manage Catagories</h4>

                    <div className="p-3">
                        <form onSubmit={(e) => submitButtonHandler(e)}>
                            <input type='text' className="form-control p-3" placeholder='Write category name' value={name} onChange={(e) => nameChangeHandler(e)}/>
                            <button className="btn btn-primary mt-3">Submit</button>
                        </form>
                        <hr/>
                        <div className='d-flex flex-wrap w-100 mt-3'>
                            {categories.map((c) => {
                                return (<div key={c._id} className='m-2 justify-content-between'>
                                            <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target={`#staticBackdrop-${c._id}`}>{c.name}</button>
                                            <Modal id={c._id} loadCategories={loadCategories}/>
                                        </div>)
                            })}
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default AdminCategory