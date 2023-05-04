import { useAuth } from "../context/auth"
import Jumbotron from "../components/cards/jumbotron"
import UserMenu from "../components/nav/UserMenu";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Form, Input, Button } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [auth,setAuth] = useAuth();
    const navigate = useNavigate()

    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    useEffect(() => {
        loadData()
    },[])

    const loadData = async() => {
        try {
            const {data} = await axios.get(`/auth/user-details/${auth?.user?.userID}`)
            setName(data?.user?.name)
            setEmail(data?.user?.email)
        } catch (error) {
            console.log(error)
            toast.error("Error getting user details!")
        }
    } 

    const updateHandler = async() => {
        try {
            const updated = await axios.put('/auth/profile',{_id:auth?.user?.userID,name,password})
            toast.success(`Updated ${updated?.data?.user?.name}`)
            navigate(`/dashboard/${updated?.data?.user?.role === 1 ?'admin':'user'}`)
        } catch (error) {
            console.log(error)
            toast.error("Error while updating!")
        }
    }

    const updateFailedHandler = () => {
        toast.error("update failed")
    }

    const formHTML = name ? <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600, marginTop: '2rem' }}
                        initialValues={{name: name,email: email}}
                        onFinish={updateHandler}
                        onFinishFailed={updateFailedHandler}
                        autoComplete="off"
                    >
                        <Form.Item
                        label="Name"
                        name="name"
                        >
                        <Input onChange={e => setName(e.target.value)}/>
                        </Form.Item>

                        <Form.Item
                        label="Email"
                        name="email"
                        >
                        <Input disabled/>
                        </Form.Item>

                        <Form.Item
                        label="Password"
                        name="password"
                        >
                        <Input.Password minLength={8} onChange={e => setPassword(e.target.value)}/>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                        </Form.Item>
                    </Form> : null;
    return (
        <>
        <Jumbotron pageTitle={`Hello ${auth?.user?.name}`} pageSubtitle='Dashboard' />
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <UserMenu/>
                </div>
                <div className="col-md-9">
                    <div className="p-3 mt-2 mb-2 bg-light">
                        <h4>Profile</h4>
                    </div>
                    {formHTML}
                </div>
            </div>
        </div>
        </>
    )
}

export default Profile