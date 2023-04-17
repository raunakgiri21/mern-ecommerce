
import React, { useEffect } from 'react'
import Jumbotron from '../../components/cards/jumbotron'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/auth'
import { Input } from 'antd'
import GoogleButton from 'react-google-button'
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
            window.open("http://localhost:8000/api/v1/auth/google", "_self")
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Google SignIn Failed!')
        }
    }
    return (
        <div>
            <Jumbotron pageTitle="Login" pageSubtitle="Welcome to React E-Commerce"/>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-md-6 offset-md-3'>
                        <form onSubmit={submitHandler}>
                            <Input type='email' className='mb-4 p-1' placeholder='Enter Your Email' value={email} onChange={(e) => emailChangeHandler(e)} autoFocus/>
                            <Input.Password minLength={8} className='mb-4 p-1' placeholder='Enter Your Password' value={password} onChange={(e) => passwordChangeHandler(e)}/>
                            <button className='btn btn-primary' type='submit'>Login</button>
                            <hr/>
                            <h5 className='text-muted'>OR</h5>
                            <GoogleButton onClick={googleBtnHandler}/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login