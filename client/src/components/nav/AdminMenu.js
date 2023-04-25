import { NavLink } from "react-router-dom"

const AdminMenu = () => {
    return (
        <>
        <div className="p-3 mt-2 mb-2 rounded" style={{backgroundColor: '#ADD8E6'}}>
            <h4>Admin Links</h4>
        </div>
        <ul className="list-group">
            <li>
                <NavLink className='list-group-item list-group-item-secondary list-group-item-action' to='/dashboard/admin/category'>Create Category</NavLink>
            </li>
            <li>  
                <NavLink className='list-group-item list-group-item-secondary list-group-item-action' to='/dashboard/admin/product'>Create Product</NavLink>
            </li>
            <li>  
                <NavLink className='list-group-item list-group-item-secondary list-group-item-action' to='/dashboard/admin/products'>Products</NavLink>
            </li>
            <li>  
                <NavLink className='list-group-item list-group-item-secondary list-group-item-action' to='/dashboard/admin/orders'>Orders</NavLink>
            </li>
        </ul>
        </>
    )
}

export default AdminMenu