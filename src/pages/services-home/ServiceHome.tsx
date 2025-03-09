import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './service-home.css'
import { useTranslation } from 'react-i18next';
function ServiceHome({ darkMode }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const { t } = useTranslation();
    const [orders, setOrders] = useState(null);
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/order/plase',
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                console.log(data);
                setOrders(data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchOrder();
    }, [])
  return (
    <div className={darkMode ? 'box-map-orders-dark' : 'box-map-orders'}>
        <h1 className="home-service-title">{t('RequestsCompleted')}</h1>
        {orders?.length === 0 ?
        <span className='no-order'>{t('ThereCurrently')}</span>
        :
        orders?.map((order, index) => (
            <div key={index} className="order-container">
                {order[0].value.map((o, index) => (
                <div key={index} className="order-content">
                  <p className="name-count">Count: {o.count}</p>
                  <p className="name-price">Price: {o.price}</p>
                  <p className="name-service">{o.title}</p>
                </div>
                ))}
            </div>
        ))}
    </div>
  )
}

export default ServiceHome