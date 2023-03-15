import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'
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
    <><li className="nav-item">
        <NavLink className="nav-link" to="/login">Login</NavLink>
    </li>
    <li className="nav-item">
        <NavLink className="nav-link" to="/register">Register</NavLink>
    </li></>
    :
    (
        <div className='dropdown'>
            <li>
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
        <ul className="nav d-flex justify-content-between shadow-sm">
        <li className="nav-item">
            <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
        </li>
        {loginRegisterHtml}
        </ul>
    )
}

export default Menu