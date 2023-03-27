import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/auth";

const UserMenu = () => {
    const [auth,setAuth] = useAuth();

    return (
        <>
        <div className="p-3 mt-2 mb-2 bg-light">
            <h4>User Links</h4>
        </div>
        <ul className="list-group">
            <li>
                <NavLink className='list-group-item list-group-item-secondary list-group-item-action' to='/dashboard/user/profile'>Profile</NavLink>
            </li>
            <li>  
                <NavLink className='list-group-item list-group-item-secondary list-group-item-action' to='/dashboard/user/orders'>Orders</NavLink>
            </li>
            <li>  
                <NavLink className='list-group-item list-group-item-secondary list-group-item-action' to={`/dashboard/user/cart/${auth?.user?.userID}`}>My Cart</NavLink>
            </li>
        </ul>
        </>
    )
}

export default UserMenu