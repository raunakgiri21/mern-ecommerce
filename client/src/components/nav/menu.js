import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import FoodStrap from '../../assets/images/FOODSTRAP.png'
import React from 'react'

const Menu = () => {
    // hooks
    const [auth,setAuth] = useAuth();
    const [cookies,setCookie,removeCookie] = useCookies()
    const navigate = useNavigate();

    const logoutHandler = () => {
        setAuth({ ...auth, user: null, token: ''});
        localStorage.removeItem('auth');
        removeCookie('user')
        removeCookie('token')
        removeCookie('session')
        removeCookie('session.sig')
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
                <NavLink className="nav-link" to={`/dashboard/user/wishlist/${auth?.user?.userID}`}><FontAwesomeIcon icon={faHeart} style={{fontSize:'20px',color:'#1284b4'}}/></NavLink>
            </li>
            <li style={{marginLeft: '1rem'}}>
                <NavLink className="nav-link" to={`/dashboard/user/cart/${auth?.user?.userID}`}><FontAwesomeIcon icon={faCartShopping} style={{fontSize:'20px',color:'#1284b4'}}/></NavLink>
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