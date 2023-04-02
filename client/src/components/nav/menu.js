import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'
import FoodStrap from '../../assets/images/FOODSTRAP.png'
import React from 'react'

const Menu = () => {
    // hooks
    const [auth,setAuth] = useAuth();
    const navigate = useNavigate();

    const logoutHandler = () => {
        setAuth({ ...auth, user: null, token: ''});
        localStorage.removeItem('auth');
        navigate('/login');
    }

    const loginRegisterHtml = !auth.user ? 
    <div className='d-flex flex-row'>
    <li className="nav-item">
        <NavLink className="nav-link" to="/login">Login</NavLink>
    </li>
    <li className="nav-item">
        <NavLink className="nav-link" to="/register">Register</NavLink>
    </li></div>
    :
    (
        <div className='dropdown d-flex flex-row'>
            <li style={{marginLeft: '1rem'}}>
                <NavLink className="nav-link" to={`/dashboard/user/wishlist/${auth?.user?.userID}`}><i className='fas fa-heart' style={{fontSize:'20px',color:'#1284b4'}}></i></NavLink>
            </li>
            <li style={{marginLeft: '1rem'}}>
                <NavLink className="nav-link" to={`/dashboard/user/cart/${auth?.user?.userID}`}><i className='fas fa-shopping-cart' style={{fontSize:'20px',color:'#1284b4'}}></i></NavLink>
            </li>
            <li style={{marginLeft: '1rem'}}>
                <a className='nav-link pointer dropdown-toggle' data-bs-toggle='dropdown'>
                    {auth?.user?.name}
                </a>
                <ul className='dropdown-menu bg-gray'>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`/dashboard/${auth?.user?.role === 1? 'admin' : 'user'}`}>Dashboard</NavLink>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link pointer" onClick={logoutHandler}>
                            LogOut
                        </a>
                    </li>
                </ul>
            </li>
        </div>
    );

    return(
        <div>
            <ul className="nav d-flex justify-content-between align-items-center shadow-sm" style={{height: '60px',paddingRight: '5vw',paddingLeft: '5vw'}}>
                <li className="nav-item">
                    <NavLink className="nav-link" aria-current="page" to="/"><img src={FoodStrap}/></NavLink>
                </li>
                {loginRegisterHtml}
            </ul>
        </div>
    )
}

export default Menu