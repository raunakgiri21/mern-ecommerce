import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Select } from "antd"
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const AdminProduct = () => {
    // context
    const [auth,setAuth] = useAuth();
    // hooks
    const navigate = useNavigate();
    // state
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadCategories()
    },[])

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
            // console.log(name,description,price,quantity,category,image)
            // console.log(image)
            const productData = new FormData(); //because we are using formidable() post request in backend
            image && productData.append("image",image);
            productData.append("name",name);
            productData.append("description",description);
            productData.append("price",price);
            productData.append("category",category);
            productData.append("quantity",quantity);
            
            // console.log([...productData])
            
            const {data} = await axios.post('/product',productData)
            if(data?.error){
                toast.error(data.error)
            }else {
                toast.success(`${data.name} is listed succesfully!`)
                navigate('/dashboard/admin/products')
            }
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
                    <div className="p-3 mt-2 mb-2 bg-light">
                        <h4>Manage Products</h4>
                    </div>

                    {/* Image Upload */}
                    {image && <div className="text-center h-50">
                            <img src={URL.createObjectURL(image)} className="h-100" alt='product image' />
                        </div>}
                    <div className="pt-2">
                        <label className="btn btn-outline-secondary col-12 mb-3">
                            {image ? image.name: 'Upload Image'}
                            <input type='file' name="image" accept='image/*' 
                        onChange={(e) => setImage(e.target.files[0])} hidden/>
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
                        placeholder="Choose category"
                        onChange={(value) => {
                            setCategory(value)
                        }}
                    >
                        {categories.map((c)  => {
                            return <Option key={c._id} value={c._id}>{c.name}</Option>
                        })}
                    </Select>
                    
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Quantity</span>
                        </div>
                        <input type="number" class="form-control" aria-label="Amount" placeholder="Enter Quantity" value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}/>
                    </div>
                    <button className="btn btn-primary mb-5" onClick={(e) => submitButtonHandler(e)}>Submit</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default AdminProduct