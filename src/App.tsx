import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/action/LoginPage';
import RegisterPage from './pages/action/RegisterPage';
import ServicePage from './components/ServicePage';
import Auth from './components/Auth';
import AddServicePage from './pages/action/AddServicePage';
import Profile from './components/Profile';
import { useEffect, useState } from 'react';
import AdminDashbord from './components/admin/AdminDashbord';
import Dollar from './pages/categories/Dollar';
import Supermarket from './pages/categories/Supermarket';
import Vegetable from './pages/categories/Vegetable';
import Food from './pages/categories/Food';
import AuthServices from './pages/categories/authServices';
import Cart from './components/Cart';
import DeliveryOrder from './components/DeliveryOrder';
import GraphHopperMap from './components/Test';
import HomeDelivery from './pages/delivery-page/HomeDelivery';
import Order from './components/Order';
import ServiceHome from './pages/services-home/ServiceHome';
import NotFoundPage from './components/NotFoundPage';
import { ToastContainer } from 'react-toastify';
import Footer from './components/footer/Footer';
import WelcomePage from './pages/welcome/WelcomePage';
import NotVerification from './components/verification/NotVerification';

function App() {
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if(user && user?.verification !== true) {
      return navigate('/wait');
    }
  }, [user]);
  return (
    <>
      <Navbar services={services} setServices={setServices} setSearch={setSearch} setDarkMode={setDarkMode} darkMode={darkMode}/>
      <ToastContainer/>
      <Routes>
      <Route path="/home" index
        element={user?.type === 'user' ? 
          <HomePage services={services} setServices={setServices} search={search} darkMode={darkMode} />
          : <NotFoundPage/>
        }
      />
        <Route path='/' element={<WelcomePage darkMode={darkMode}/>}/>
        
        <Route path='/dollar' element={user?.type === 'user' ? <Dollar darkMode={darkMode}/>
        : <NotFoundPage/>}/>
        <Route path='/food' element={user?.type === 'user' ? <Food darkMode={darkMode}/>
        : <NotFoundPage/>}/>
        <Route path='/supermarket' element={user?.type === 'user' ? <Supermarket darkMode={darkMode}/> 
        : <NotFoundPage/>}/>
        <Route path='/vegetable' element={user?.type === 'user' ? <Vegetable darkMode={darkMode}/>
        : <NotFoundPage/>}/>
        <Route path='/auth-services' element={user?.type === 'user' ? <AuthServices darkMode={darkMode}/>
        : <NotFoundPage/>}/>

        <Route path='/test' element={user?.type === 'user' ? <GraphHopperMap/>
        : <NotFoundPage/>}/>
        <Route path='/delivery-order' element={user?.type === 'delivery' ? <DeliveryOrder darkMode={darkMode}/>
        : <NotFoundPage/>}/>
        <Route path='/order' element={user?.type === 'service' ? <Order darkMode={darkMode}/>
        : <NotFoundPage/>}/>
        <Route path='/services' element={user?.type === 'service' ? <ServiceHome darkMode={darkMode}/>
        : <NotFoundPage/>}/>

        <Route path='/profile' element={<Profile darkMode={darkMode}/>}/>
        <Route path='/service/:id' element={user?.type === 'user' ? <ServicePage cart={cart} setCart={setCart} darkMode={darkMode}/>
        : <NotFoundPage/>}/>
        <Route path='/auth/profile/:id' element={user?.type === 'user' ? <Auth cart={cart} setCart={setCart} darkMode={darkMode}/>
        : <NotFoundPage/>}/>
        <Route path='/cart' element={user?.type === 'user' ? <Cart cart={cart} setCart={setCart} darkMode={darkMode}/>
        : <NotFoundPage/>}/>
        <Route path='/add' element={user?.type === 'service' ? <AddServicePage darkMode={darkMode}/>
        : <NotFoundPage/>}/>
        <Route path='/login' element={<LoginPage darkMode={darkMode}/>}/>
        <Route path='/register' element={<RegisterPage darkMode={darkMode}/>}/>
        
        <Route path='/admin' element={user?.isAdmin ? <AdminDashbord/> 
        : <NotFoundPage/>
        }/>

        <Route path='/delivery' element={user?.type === 'delivery' ? <HomeDelivery darkMode={darkMode}/>
        : <NotFoundPage/>}/>

        <Route path='/wait' element={<NotVerification darkMode={darkMode}/>}/>
        
        <Route path='*' element={<NotFoundPage darkMode={darkMode}/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;

