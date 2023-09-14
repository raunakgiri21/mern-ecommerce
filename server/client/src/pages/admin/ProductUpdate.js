import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Select } from "antd"
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const AdminProductUpdate = () => {
    // context
    const [auth,setAuth] = useAuth();
    // hooks
    const navigate = useNavigate();
    const params = useParams();
    // state
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [imgSrc, setImgSrc] = useState('');
    const [imageChange, setImageChange] = useState(false)

    const populateForm = (data) => {
        setId(data._id)
        setCategory(data.category._id);
        setName(data.name);
        setImage(data.image);
        setDescription(data.description);
        setPrice(data.price);
        setQuantity(data.quantity);
    }

    useEffect(() => {
        loadCategories()
    },[])

    useEffect(() => {
        loadProduct()
    },[])
    
    const loadCategories = async() => {
        try {
            const {data} = await axios.get('/category');
            setCategories(data);
        } catch (error) {
            toast.error(error.response.data.error)
        }
    }
    const loadProduct = async() => {
        try {
            const {data} = await axios.get(`/product/${params?.slug}`);
            populateForm(data) 
            if(!data.image){
                return toast.error("Product image not found!")
            }
            setImgSrc(`data:${data.image.contentType};base64,${data.image.imageBase64}`);
            
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.error)
        }
    }
    
    const submitButtonHandler = async(e) => {
        e.preventDefault();
        try {
            const productData = new FormData(); //because we are using formidable() post request in backend
            imageChange && productData.append("image",image);
            productData.append("name",name);
            productData.append("description",description);
            productData.append("price",price);
            productData.append("category",category);
            productData.append("quantity",quantity);
            
            // console.log([...productData])
            
            const {data} = await axios.patch(`/product/${id}`,productData)
            if(data?.error){
                toast.error(data.error)
            }else {
                toast.success(`${data.name} is updated succesfully!`)
                navigate('/dashboard/admin/products')
            }
        } catch (error) {
            toast.error(error.response.data.error || "Failed")
            console.log(error)
        }
    }

    const deleteButtonHandler = async(e) => {
        e.preventDefault();
        try {
            let answer = window.confirm("Do You Really Want To Delete This Product?")
            if(!answer){
                return
            }
            const {data} = await axios.delete(`product/${id}`)
            toast.success(`${data.name} is deleted succesfully!`)
            navigate('/dashboard/admin/products')
        } catch (error) {
            toast.error(error.response.data.error || "Failed")
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
                <div className="col-md-9 bg-light rounded h-100">
                    <div className="p-3 mt-2 mb-2 bg-light rounded">
                        <h4>Update Product</h4>
                    </div>

                    {/* Image Upload */}
                    {image && <div className="text-center h-50">
                        <img src={imgSrc || `data:${image.contentType};base64,${image.imageBase64}`} className="h-100" alt='product image' />
                        </div>}
                    <div className="pt-2">
                        <label className="btn btn-outline-secondary col-12 mb-3">
                            {image ? (image.name?image.name : 'Change image') : 'Upload Image'}
                            <input type='file' name="image" accept='image/*' 
                        onChange={(e) => {
                            try {
                                setImageChange(true)
                                setImage(e.target.files[0]);
                                setImgSrc(URL.createObjectURL(e.target.files[0]));
                            } catch (error) {
                                console.log(error)
                            }
                        }} hidden/>
                        </label>
                    </div>

                    <input type='text' className="form-control p-2 mb-3" placeholder="Enter Product Name" value={name}
                    onChange={(e) => setName(e.target.value)}/>
                    <textarea type='text' className="form-control p-2 mb-3" placeholder="Write Product Description" value={description}
                    onChange={(e) => setDescription(e.target.value)}/>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">₹</span>
                        </div>
                        <input type="number" className="form-control" aria-label="Amount" placeholder="Enter Product Price" value={price}
                        onChange={(e) => setPrice(e.target.value)}/>
                        <div className="input-group-append">
                            <span className="input-group-text">.00</span>
                        </div>
                    </div>
                    {/* Select Category */}
                    <Select
                        // showSearch
                        bordered={false} size='large' className="form-select mb-3"
                        placeholder="Choose category" value={category}
                        onChange={(value) => {
                            setCategory(value)
                        }}
                    >
                        {categories.map((c)  => {
                            return <Option key={c._id} value={c._id}>{c.name}</Option>
                        })}
                    </Select>
                    
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Quantity</span>
                        </div>
                        <input type="number" className="form-control" aria-label="Amount" placeholder="Enter Quantity" value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}/>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary mb-5" onClick={(e) => submitButtonHandler(e)}>Update</button>
                        <button className="btn btn-danger mb-5" onClick={(e) => deleteButtonHandler(e)}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default AdminProductUpdate