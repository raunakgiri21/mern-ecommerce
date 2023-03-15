import { useAuth } from "../../context/auth"
import Jumbotron from "../../components/cards/jumbotron"
import UserMenu from "../../components/nav/UserMenu";
const UserDashboard = () => {
    const [auth,setAuth] = useAuth();

    return (
        <>
        <Jumbotron pageTitle={`Hello ${auth?.user?.name}`} pageSubtitle='User Dashboard' />
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <UserMenu/>
                </div>
                <div className="col-md-9">
                    <div className="p-3 mt-2 mb-2 bg-light">
                        <h4>User Information</h4>
                    </div>
                    <ul className="list-group">
                        <li className="list-group-item">{auth?.user?.name}</li>
                        <li className="list-group-item">{auth?.user?.email}</li>
                        <li className="list-group-item">{auth?.user?.role === 1 ? 'Admin' : 'User'}</li>
                    </ul>
                </div>
            </div>
        </div>
        </>
    )
}

export default UserDashboard