import { useEffect, useState } from 'react'
import axios from 'axios'
import './fileCss/order.css'
import { useTranslation } from 'react-i18next';

function Order({ darkMode }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [error, setError] = useState();
    const [orders, setOrders] = useState();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orders = await axios.get('http://localhost:5000/api/order/order-finish',
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                setOrders(orders.data);
                console.log(orders.data);
                
            } catch (error) {
                setError(error.response?.data?.message);
                console.log(error);
            }
        }
        fetchOrders();
    }, [])

    return (
        <div className={darkMode ? 'order-plase-container-dark' : "order-plase-container"}>
            <h1 className='plase-title'>{t('OrdersToday')}</h1>
            {orders?.length !== 0 ? 
            orders?.map((order, index) => (
                <div className="order-plase" key={index}>
                    {order[0]?.value?.map((o) => (
                        <div className="order-content">
                          <p>Count: {o.count}</p>
                          <p>Price: {o.price}</p>
                          <p>{o.title}</p>
                        </div>
                    ))}
                </div>
            ))
            :
            <span className='no-order'>{t('ThereToday')}</span>}
            <p className="information-order-plase">
              {t('number-requests')}: {orders?.length}
            </p>
        </div>
    )
}

export default Order