import React, { useEffect, useState } from "react";
import axios from "axios";
import "./fileCss/delivery-order.css";
import { useTranslation } from "react-i18next";

function DeliveryOrder({ darkMode }) {
  const user = JSON.parse(localStorage.getItem("user"));
      const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [money, setMoney] = useState(0);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState("");
  

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let totalMoney = 0;
    let totalPrice = 0;

    orders.forEach((order) => {
      totalPrice += order.totalPrice;
      totalMoney += 100000;
    });

    setPrice(totalPrice);
    setMoney(totalMoney);
  }, [orders]); 

  const fetchOrders = async () => {
    console.log('ok');
    try {
    console.log('tryok');
      const response = await axios.get("http://localhost:5000/api/order", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(response);
      setOrders(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "⚠️ خطأ في جلب الطلبات");
      console.log(error.response?.data?.message || "⚠️ خطأ في جلب الطلبات");
    }
  };

  return (
    <div className={darkMode ? "orders-dark" : "orders"}>
    <h1 className='plase-title'>{t('OrdersToday')}</h1>
      {error ? <p>{error}</p> 
      : orders.length === 0 ?
      <span className='no-order'>{t('ThereToday')}</span>
    :
    orders.map((order) => (
      <div key={order._id} className="item-orders">
        <div className="left">
          <p>{order.userOrder.name}</p>
          <p>{order.totalPrice}</p>
        </div>
      </div>
    ))}
      
      {orders && 
        <div className="botton-delivery">
          <div className="monePush">{t('money-paid')}: {price}</div>
          <div className="moneMy">{t('income-day')}: {money}</div>
          <div className="lengthOrder">{t('number-requests')}: {orders.length}</div>
        </div>}
    </div>
  );
}

export default DeliveryOrder;
