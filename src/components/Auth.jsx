import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import './fileCss/authPlusServicePage.css';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";

function Auth({darkMode, setCart, cart}) {
  const user = JSON.parse(localStorage.getItem('user'))
    const { id } = useParams();
        const { t } = useTranslation();
    const navigate = useNavigate();
    const [auth, setAuth] = useState();
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const [save, setsave] = useState('');

    useEffect(() => {
      if (!user) return navigate('/login');
        const fetchauth = async() => {
          try {
            const {data} = await axios.get(`http://localhost:5000/api/auths/auth/${id}`,
              { headers: { Authorization: `Bearer ${user.token}` } });
            setAuth(data.auth);
            setServices(data.service);
          } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch auth.');
          }
        };

        const fetchIsSave = async () => {
          try {
            const { data } = await axios.get(`http://localhost:5000/api/auths/save/${id}`,
              { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setsave(data.message);
          } catch (error) {
            setError(error.response?.data?.message);
          }
        }
        fetchIsSave();
        fetchauth();
    }, []);

    const hundlerSave = async () => {
      try {
        await axios.post(`http://localhost:5000/api/auths/save/${id}`,{},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      setsave(prev => !prev);
      toast.success(save ? t('RemovedWallet') : t('AddedWallet'));
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to saved.');
      }
    }

    const handlerAddToCart = (service) => {
      const lengthcart = cart.filter(item => item._id === service._id);
      if(lengthcart.length === 10) return setError('Maximum Ten');
      setCart([...cart, service]);      
  }
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  return (
    error ? <p className='error'>{error}</p> :
    <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={{ duration: 0.5 }}
  >
    <div className="auth-con">
    <div className={darkMode ? 'auth-dark' : 'auth'}>
      <div className='profile'>
        <div className="img">
          <img src={`http://localhost:5000${auth?.image}`} alt="" />
        </div>
        <div className="information">
          <div className="left">
          <div className="name">Name: {auth?.name}</div>
          <div className="loaction">Location: {auth?.location.locationName}</div>
          </div>
          {user.type === 'user' && 
            <div className="save">
              <button onClick={hundlerSave}>
                {save ? <i className="bi bi-bookmark-fill icon"></i> : <i className="bi bi-bookmark"></i>}
              </button>
            </div>}
        </div>
        </div>
        <div className="serviceAuth">
          {services.map((ser) => (
            <div key={ser._id} className='to-go'>
              <div className="image">
              <img src={`http://localhost:5000${ser?.image}`} alt="" />
              {user.type === 'user' && <button onClick={() => handlerAddToCart(ser)} className='service-btn'>+ {t('addcrt')}</button>}
              </div>
              <Link className="down" to={`/service/${ser._id}`}>
                <div className="title">Name: {ser.title}</div>
                <div className="price">Price: {ser.price}</div>
              </Link>
            </div>
          ))}
        </div>
    </div>
    </div>
    </motion.div>
  )
}

export default Auth