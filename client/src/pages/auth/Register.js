import React from 'react'
import Jumbotron from '../../components/cards/jumbotron'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'


const Register = () => {
    // state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // hooks
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const nameChangeHandler = (e) => {
        const newName = e.target.value;
        setName(newName);
    }
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
            const {data} = await axios.post(`/auth/register`,{name,email,password});
            console.log(data)
            if(data?.error){
                toast.error(data.error)
            }
            else{
                localStorage.setItem("auth",JSON.stringify(data));
                setAuth({...auth, token: data.token, user: data.user})
                toast.success('Registration Successful!')
                navigate('/')
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Registration Failed!')
        }
    }
    return (
        <div>
            <Jumbotron pageTitle="Register" pageSubtitle="Welcome to FoodStrap E-Commerce"/>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-md-6 offset-md-3'>
                        <form onSubmit={submitHandler}>
                            <input type='text' className='form-control mb-4 p-1' placeholder='Enter Your Name' value={name} onChange={(e) => nameChangeHandler(e)} autoFocus/>
                            <input type='email' className='form-control mb-4 p-1' placeholder='Enter Your Email' value={email} onChange={(e) => emailChangeHandler(e)}/>
                            <input type='password' className='form-control mb-4 p-1' placeholder='Enter Your Password' value={password} onChange={(e) => passwordChangeHandler(e)}/>
                            <button className='btn btn-primary' type='submit'>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register