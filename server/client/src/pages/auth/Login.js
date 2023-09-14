
import React, { useEffect } from 'react'
import Jumbotron from '../../components/cards/jumbotron'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/auth'
import { Input } from 'antd'
import googleIcon from '../../assets/images/btn_google_signin_light_normal_web.png' 
import { useLocation, useNavigate } from 'react-router-dom'

const Login = () => {
    // state
    const [email, setEmail] = useState('user@01');
    const [password, setPassword] = useState('user01@123');
    // hooks
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const emailChangeHandler = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
    }
    const passwordChangeHandler = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    }
    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post(`/auth/login`,{email,password});
            if(data?.error){
                toast.error(data.error)
            }
            else{
                localStorage.setItem("auth",JSON.stringify(data));
                setAuth({...auth, token: data.token, user: data.user})
                toast.success('Login Successful!')
                navigate(location.state || `/dashboard/${data.user.role === 1 ?'admin':'user'}`)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Login Failed!')
        }
    }

    const googleBtnHandler = async() => {
        try {
            const newWindow = window.open("/api/v1/auth/google", "_self")
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Google SignIn Failed!')
        }
    }
    return (
        <div>
            <Jumbotron pageTitle="Login" pageSubtitle="Welcome to FoodStrap E-Commerce"/>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-md-6 offset-md-3'>
                        <form onSubmit={submitHandler}>
                            <Input type='email' className='mb-4 p-1' placeholder='Enter Your Email' value={email} onChange={(e) => emailChangeHandler(e)} autoFocus/>
                            <Input.Password minLength={8} className='mb-4 p-1' placeholder='Enter Your Password' value={password} onChange={(e) => passwordChangeHandler(e)}/>
                            <button className='btn btn-primary' type='submit'>Login</button>
                            <hr/>
                            <div className='d-flex col'>
                            <h5 className='text-muted m-2'>OR</h5>
                            </div>
                        </form>
                        <button className='btn-ggl p-0' onClick={googleBtnHandler}><img src={googleIcon} style={{objectFit: 'fill'}}></img></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login