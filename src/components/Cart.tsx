import React, { useEffect, useState } from 'react';
import './fileCss/cart.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'
import i18n from 'i18next';
import axios from 'axios';

function Cart({ cart, setCart, darkMode }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const address = JSON.parse(localStorage.getItem('address'));
  const order = JSON.parse(localStorage.getItem('order'));
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [price, setPrice] = useState(0);

  const [editLocation, setEditLocation] = useState(false);

  // دالة لإعادة هيكلة العناصر مع العدّ
  const getFilteredCart = () => {
    const frequencyMap = new Map();
    cart?.forEach((item) => {
      const key = JSON.stringify(item);
      frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1);
    });

    return Array.from(frequencyMap.entries()).map(([key, value]) => ({
      element: JSON.parse(key),
      count: value,
    }));
  };
  const getPostCart = () => {
    const groupedData = filterCarts?.reduce((acc, { count, element }) => {
      const { auth, image, price, title } = element;
      const {authId, name} = auth
      const location = {
        latitude: 34.1806717,
        longitude: 36.4195088
      }
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push({ count, image, price, title, name, authId, location }); // إضافة البيانات مع الاحتفاظ بـ count
      // return {count, image, price, title, name, authId};
      return acc
    }, {});
    
    return Object.entries(groupedData).map(([key, value]) => ({ key, value }));
  };
  const filterCarts = getFilteredCart();
  const sendOrder = getPostCart();

  // تحديث إجمالي السعر
  useEffect(() => {
    console.log(filterCarts);
    ifAccsept(order);
    const totalPrice = filterCarts.reduce(
      (acc, item) => acc + item.element.price * item.count,
      0
    );
    setPrice(totalPrice);
  }, [cart]);

  // إضافة عنصر إلى السلة
  const pluse = (element, count) => {
    if (count === 10) {
      setError('لا يمكنك إضافة أكثر من 10 عناصر من هذا المنتج.');
      return;
    }
    setCart([...cart, element]); // استخدام Spread Operator
  };
  // تقليل عنصر من السلة
  const miynes = (element) => {
    const index = cart.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(element)
    );
    if (index > -1) {
      const updatedCart = [...cart];
      updatedCart.splice(index, 1); // حذف عنصر واحد
      setCart(updatedCart);
    }
  };

  const setaddresslocation = (locName) => {
    localStorage.setItem('address', JSON.stringify(locName));
    setEditLocation(false);
  }

  const addOrder = async () => {
    try {
      if (!cart) return console.log('you dont have order');
      
      const { data } = await axios.post('http://localhost:5000/api/order',
        {
          userLocation: address,
          servicesOrder: sendOrder,
          totalPrice: price
        },
        {headers: { Authorization: `Bearer ${user.token}` }}
      );
      console.log(sendOrder)
      console.log(filterCarts)
      console.log(data)
      setCart(null);
      localStorage.setItem('order', JSON.stringify(data.message))
      setInterval(() => {
        ifAccsept(data.message);
      }, 5000);
    } catch (error) {
        setError(error.response?.data?.message);
        console.log(error);
    };
  };

  const ifAccsept = async (orderId) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/order/ifrun',
        { orderId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (data.message === 'run') {
        return navigate('/test');
      };
      console.log(data)
    } catch (error) {
      console.error("❌ خطأ أثناء إرسال الطلب:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "⚠️ حدث خطأ غير متوقع!");
    }
  };

  return (
    <div className={darkMode ? "dark-mode-cart" : "day-mode"}>
          <div className='carts'>
      {error && <div className="error">{error}</div>}
      <div className="content">
        {filterCarts?.map((item, index) => (
          <div className="cart" key={`${item.element.id}-${index}`}>
            <img src={`http://localhost:5000${item.element?.image}`} alt={item.element?.title} />
            <div className="content">
              <div className="text">
                <h1>{item.element?.title}</h1>
                <p>السعر: {item.element?.price} × {item.count}</p>
              </div>
            </div>
            <div className="button">
              <button onClick={() => pluse(item.element, item.count)}>+</button>
              <span>{item.count}</span>
              <button onClick={() => miynes(item.element)}>-</button>
            </div>
          </div>
        ))}
      </div>
      <div className={i18n.language === 'en' ? "rigth" :"left"}>
        <div className="location">
          <p className='title-location'>{t(address?.locationName)}</p>
          <iframe
            src={`https://www.google.com/maps?q=${address.latitude},${address.longitude}&z=15&output=embed`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <p>{address?.city},{address?.floor}</p>
          <button onClick={() => setEditLocation(prev => !prev)}>{editLocation ? <i className="bi bi-caret-down-fill"></i>
           : <i className="bi bi-caret-up-fill"></i>}
           {t('Change location')}</button>
        </div>
        <div className="final-price">
          <div className="price">{t('Total')}: {price + 2} ({t('Delivery included')})</div>
          <button onClick={addOrder} className="send">{t('Confirm order')}</button>
        </div>
      </div>
      {editLocation && <div className={i18n.language === 'en' ? "addressEn" : "addressAr"}>
      {user.location.map((loc, index) => (
              <div key={index} className='address'>
                <input type="radio"checked={address.locationName === loc.locationName} 
                onChange={() => setaddresslocation(loc)}/>
                <div className="name">{loc?.locationName || 'Home'}
                  <p>{loc?.city || 'hermel'},{loc?.floor || ' two'}</p>
                </div>
              </div>
                ))}
              </div>
      }
    </div>
    </div>
  );
}

export default Cart;
