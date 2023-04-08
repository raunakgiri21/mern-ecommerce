import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Menu from './components/nav/menu';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

import UserDashboard from './pages/user/Dashboard';
import Profile from './pages/Profile';
import Orders from './pages/user/Orders';
import Cart from './pages/user/Cart';
import Wishlist from './pages/user/Wishlist';

import AdminDashboard from './pages/admin/Dashboard';
import AdminCategory from './pages/admin/Category';
import AdminProduct from './pages/admin/Product';
import AdminProducts from './pages/admin/Products';
import AdminProductUpdate from './pages/admin/ProductUpdate';

import {Toaster} from 'react-hot-toast'
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';

import ProductView from './pages/ProductView';

function App() {
  return (
    <BrowserRouter>
      <Menu/>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>

        <Route path='/product/:slug' element={<ProductView/>}/>

        <Route path='/dashboard' element={<PrivateRoute/>}>
          <Route path='user' element={<UserDashboard/>}/>
          <Route path='user/profile' element={<Profile/>}/>
          <Route path='user/orders' element={<Orders/>}/>
          <Route path='user/cart/:userID' element={<Cart/>}/>
          <Route path='user/wishlist/:userID' element={<Wishlist/>}/>
        </Route>
        <Route path='/dashboard' element={<AdminRoute/>}>
          <Route path='admin' element={<AdminDashboard/>}/>
          <Route path='admin/category' element={<AdminCategory/>}/>
          <Route path='admin/product' element={<AdminProduct/>}/>
          <Route path='admin/products' element={<AdminProducts/>}/>
          <Route path='admin/product/update/:slug' element={<AdminProductUpdate/>}/>
        </Route>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
