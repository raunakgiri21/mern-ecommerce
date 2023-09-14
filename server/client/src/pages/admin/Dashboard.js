import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import AdminMenu from "../../components/nav/AdminMenu";
const AdminDashboard = () => {
    const [auth,setAuth] = useAuth();

    return (
        <div>
        <Jumbotron pageTitle={`Hello ${auth?.user?.name}`} pageSubtitle='Admin Dashboard' />
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu/>
                </div>
                <div className="col-md-9">
                <div className="p-3 mt-2 mb-2 rounded" style={{backgroundColor: '#ADD8E6'}}>
                        <h4>Admin Information</h4>
                    </div>
                    <ul className="list-group">
                        <li className="list-group-item">{auth?.user?.name}</li>
                        <li className="list-group-item">{auth?.user?.email}</li>
                        <li className="list-group-item">{auth?.user?.role === 1 ? 'Admin' : 'User'}</li>
                    </ul>
                </div>
            </div>
        </div>
        </div>
    )
}

export default AdminDashboard