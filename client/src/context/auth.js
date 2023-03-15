import React from "react";
import { useState, createContext, useContext,useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({
        user: null,
        token: '',
    });

    // axios config
    axios.defaults.baseURL = process.env.REACT_APP_API;
    axios.defaults.headers.common['Authorization'] = "Bearer " + auth?.token;
    
    useEffect(() => {
        const data = localStorage.getItem('auth');
        if(data){
            const parsedData = JSON.parse(data);
            setAuth({...auth,user: parsedData.user, token: parsedData.token})
        }
        // console.log("[AuthProvider] useEffect",auth?.token);
    },[]);
    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext)

export {useAuth,AuthProvider}