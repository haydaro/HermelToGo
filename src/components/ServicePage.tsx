import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './fileCss/authPlusServicePage.css';
import { motion } from "framer-motion";

function ServicePage({darkMode, setCart, cart}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const { t } = useTranslation();

    const [service, setServices] = useState([]);
    const [error, setError] = useState(false);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const fetchService = async () => {
            try {
                if (!user) return navigate('/login');
                const response = await axios.get(`http://localhost:5000/api/services/${id}`,
                    { headers: { Authorization: `Bearer ${user.token}` } });
                setServices(response.data);
                
                const lengthcart = cart.filter(item => item._id === response.data._id);
                setValue(lengthcart.length);
            } catch (error) {
              setError(error.response?.data?.message || 'Failed to fetch services.');
            }
        }
        fetchService();
    }, []);

    const handlerAddToCart = () => {
        if (value === 10) return setError('Maximum Ten');
        const lengthcart = cart.filter(item => item._id === service._id);
        if(lengthcart.length === 10) return setError('Maximum Ten');
        setCart([...cart, service]);
        setValue(value + 1);
    }

    const handlerRemoveToCart = () => {
        if (value === 0) return;
        const index = cart.findIndex(item => item._id === service._id);
        if (index !== -1) {
            const apdateCart = [...cart]
            apdateCart.splice(index, 1);
            setCart(apdateCart);
            setValue(value - 1);
        }
    }
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };
  return (
        <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
      >
    <div className="service-con">
    <div className={darkMode ? 'service-drk' : 'service'}>
        <img src={`http://localhost:5000${service.image}`} alt="" />
        <div className="row">
        <div className="more">
            <h1 className='title'>{service.title}</h1>
            <p className="description">{service.description}</p>
            <p className="location">{t('location')}: {t(service.loaction)}</p>
            <p className="location">{t('price')}: {t(service.price)}</p>
        </div>
        <div className="rigth">
            {user.type === 'user' && 
            <div className="add-to-cart">
                <button onClick={handlerAddToCart} className='service-btn'>+ {t('addcrt')}</button>
                <div className="range">
                    <button onClick={handlerAddToCart}>+</button>
                    {value}
                    <button onClick={handlerRemoveToCart}>-</button>
                </div>
            </div> }
            <Link to={`/auth/profile/${service?.auth?.authId}`} className="name">
            {t('vieprf')}
            {service?.auth?.name}
            </Link>
        </div>
        </div>
    </div>
    </div>
    </motion.div>
  )
}

export default ServicePage;