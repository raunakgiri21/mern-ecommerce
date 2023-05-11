import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import AdminMenu from "../../components/nav/AdminMenu";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Spin, Empty, Button } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const Orders = () => {
    // context
    const [auth,setAuth] = useAuth();
    // state
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        if(auth?.token) getAllUsers();
    },[auth?.token])

    const getAllUsers = async() => {
        try {
            setLoading(prev => !prev)
            const {data} = await axios.get("/auth/all-users")
            setUsers(data)
            setLoading(prev => !prev)
        } catch (error) {
            setLoading(prev => !prev)
            toast.error("Error fetching users datas!")
        }
    }

    const deleteUserHandler = async(_id,name) => {
        try {
            const {data} = await axios.delete(`/auth/delete-user/${_id}`)
            getAllUsers()
            toast.success(`${name} account deleted`)
        } catch (error) {
            toast.error("Error deleting the user!")
        }
    }

    return (
        <>
        <Jumbotron pageTitle={`Hello ${auth?.user?.name}`} pageSubtitle='Order History' />
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu/>
                </div>
                <div className="col-md-9">
                    <div className="p-3 mt-2 mb-2 bg-light">
                        <h4>Registered Users</h4>
                    </div>
                    {
                        loading?
                        <div className="h-100 d-flex align-items-center justify-content-center" >
                            <Spin size='large'/>
                        </div>:
                        <div className="row p-3 overflowY-auto mh-100">
                            <div className="table-responsive border shadow bg-light rounded-4 mb-5 overflowX-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">ID</th>
                                            <th scope="col">Role</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            {/* <th scope="col">Phone</th>
                                            <th scope="col">Address</th> */}
                                            <th scope="col">Registered On</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users?.map((u,i) => {
                                            return (
                                                <tr key={u?._id}>
                                                    <td>{i+1}</td>
                                                    <td>{u?._id}</td>
                                                    <td>{u?.role?"Admin":"User"}</td>
                                                    <td>{u?.name}</td>
                                                    <td>{u?.email}</td>
                                                    {/* <td>{u?.phone?(u?.phone):'N/A'}</td>
                                                    <td>{u?.address?(u?.address):'N/A'}</td> */}
                                                    <td>{moment(u?.createdAt).format("DD-MM-YYYY")}</td>
                                                    <td>{!u?.role? <Button danger onClick={(e) => deleteUserHandler(u?._id,u?.name)}>Delete</Button>: null}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default Orders