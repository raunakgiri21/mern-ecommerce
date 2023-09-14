import { useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"


const Modal = ({id,loadCategories}) => {
    // state
    const [name,setName] = useState('')

    const nameChangeHandler = (e) => {
        e.preventDefault();
        setName(e.target.value);
    }
    const resetHandler = () => {
        setName('');
    }

    const editCategory = async() => {
        try {
            if(!name){
                return toast.success("Saved Changes!")
            }
            const {data} = await axios.put(`/category/${id}`,{name});
            if(data?.error){
                toast.error(data.error)
            }else {
                setName('')
                loadCategories();
                toast.success(`"${data.name}" category is edited!`)
            }
        } catch (error) {
            toast.error(error.response.data.error || error.response.data.codeName)
        }
    }

    const deleteCategory = async() => {
        try {
            const {data} = await axios.delete(`/category/${id}`);
            if(data?.error){
                toast.error(data.error)
            }else {
                setName('')
                loadCategories();
                toast.success(`"${data.name}" category is deleted!`)
            }
        } catch (error) {
            toast.error(error.response.data.error)
        }
    }

    return (
    // <!-- Modal -->
    <div className="modal fade" id={`staticBackdrop-${id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div className="modal-dialog">
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">Edit Category</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetHandler}></button>
        </div>
        <div className="modal-body">
            <input type='text' className="form-control p-3" placeholder='Change category name' value={name} onChange={(e) => nameChangeHandler(e)}/>
        </div>
        <div class="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetHandler}>Close</button>
            <button type="button" className="btn btn-primary" onClick={editCategory} data-bs-dismiss="modal">Save</button>
            <button type="button" className="btn btn-danger" onClick={deleteCategory} data-bs-dismiss="modal">Delete</button>
        </div>
        </div>
    </div>
    </div>
    )
}

export default Modal