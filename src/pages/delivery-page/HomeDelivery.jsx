import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import './delivery.css';
import { useTranslation } from 'react-i18next';

function HomeDelivery({darkMode}) {
    const user = JSON.parse(localStorage.getItem('user'));
    const { t } = useTranslation();

    const navigate = useNavigate();
    const apiKey = '7e42b8e2-47f0-4cdc-88f2-5a4fc78c9ab0'; // ضع مفتاح API الخاص بك هنا
    const [error, setError] = useState('');

    const [informationOrder, setInformationOrder] = useState(null);
    const [leftInformation, setLeftInformation] = useState(true);
    const [order, setOrder] = useState(null);
    const [startOrder, setStartOrder] = useState(false);

    const [route, setRoute] = useState([]);
    const [start, setStart] = useState([0, 0]);
    const [end, setEnd] = useState([0, 0]);
    const [mapShow, setMapShow] = useState(false);
    
    useEffect(() => {
        const fetchIfOrderRun = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/order/ifrun', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                
                if(data.message === false) return navigate('/delivery');

                setEnd([data.userLocation.latitude, data.userLocation.longitude]);
                setOrder(data);
                setInformationOrder(data.informationOrder);
                try {
                    // setInterval(() => {
                        const fetchRoute = async () => {
                            const location = await getLocationDelivery();
                            setStart(location)
                            console.log('start',location);
                            const url = `https://graphhopper.com/api/1/route?point=${location.join(",")}&point=${data.userLocation.latitude},${data.userLocation.longitude}&vehicle=car&locale=en&key=${apiKey}&points_encoded=false`;
        
                            const routeResponse = await fetch(url);
                            const routeData = await routeResponse.json();
                
                            setRoute(routeData.paths[0].points.coordinates.map(coord => [coord[1], coord[0]]));
                            setStartOrder(true);
                            setMapShow(true);
                            senLocationDelivery(data._id);
                        }
                        fetchRoute();
                    // }, 5000);
                } catch (error) {
                    console.error("❌ خطأ في جلب المسار:", error);
                }
            } catch (error) {
                setError(error.response?.data?.message || '❌ فشل في جلب الطلب.');
                console.error("❌ خطأ في جلب البيانات:", error);
            }
        };
    
        fetchIfOrderRun();
    }, []);

    useEffect(() => {
        if (informationOrder && informationOrder.userLocation) {
            setEnd([
                informationOrder.userLocation.latitude,
                informationOrder.userLocation.longitude
            ]);
        }
    }, [informationOrder]);

    const hundlerSearchDekivery = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/order/search', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
    
            const deliveryData = response.data; // تخزين البيانات في متغير محلي
            console.log(deliveryData);
            
            setOrder(deliveryData); // تحديث حالة mapDelivery
            setInformationOrder(deliveryData.informationOrder)
    
            if (deliveryData && deliveryData.userLocation) {
                setEnd([
                    deliveryData.userLocation.latitude,
                    deliveryData.userLocation.longitude
                ]);
            }
            const location = await getLocationDelivery();
            setStart(location);
            console.log("📍 موقع المستخدم:", deliveryData.userLocation);
    
            const url = `https://graphhopper.com/api/1/route?point=${location.join(",")}&point=${deliveryData.userLocation.latitude},${deliveryData.userLocation.longitude}&vehicle=car&locale=en&key=${apiKey}&points_encoded=false`;
    
            const routeResponse = await fetch(url);
            const routeData = await routeResponse.json();
    
            if (routeData.paths && routeData.paths.length > 0) {
                setRoute(routeData.paths[0].points.coordinates.map(coord => [coord[1], coord[0]]));
            }
            setMapShow(true);
        } catch (error) {
            setError(error.response?.data?.message || '❌ فشل في جلب الطلب.');
            console.error("❌ خطأ في جلب البيانات:", error);
        }
    };
    const hundlerStartOrder = async () => {
        try {
            await axios.post('http://localhost:5000/api/order/accept',
                {order: order._id},
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            console.log(order?._id);
            
            setStartOrder(true);
            setInterval(() => {
            senLocationDelivery(order._id);
            }, 5000);
        } catch (error) {
            setError(error.response?.data?.message || '❌ فشل في جلب الطلب.');
            console.error("❌ خطأ في جلب البيانات:", error);
            console.log(order._id);
        }
    };
    const senLocationDelivery = async (data) => {
        const location = await getLocationDelivery();
        try {
            await axios.post('http://localhost:5000/api/order/update',
                {
                    orderId: data,
                    locationDelivery: location,
                },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            console.log('start');
        } catch (error) {
            setError(error.response?.data?.message || '❌ فشل في جلب الطلب.');
            console.error("❌ خطأ في جلب البيانات:", error);
        }
            
    };
    const hundlerFinichOrder = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/order/finich',
                {order: order._id},
                { headers: { Authorization: `Bearer ${user.token}` } }
            );            
            console.log(response);
            setStartOrder(false);
            setMapShow(false);
        } catch (error) {
            setError(error.response?.data?.message || '❌ فشل في جلب الطلب.');
            console.error("❌ خطأ في جلب البيانات:", error);
        }
    };

    const getLocationDelivery = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    reject("⚠️ خطأ في تحديد الموقع: " + error.message);
                },
                { enableHighAccuracy: true }
            );
        });    
    }
    const customIcon = new L.Icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        shadowSize: [41, 41]
    });
    const motorcycleIcon = L.divIcon({
      className: 'custom-motorcycle-icon',
      html: '<i class="fa-solid fa-motorcycle"></i>',
      iconSize: [30, 30], // حجم الأيقونة
      iconAnchor: [15, 15], // نقطة الارتكاز
    });
  return (
    <div className={darkMode ? "delivery-dark" : "delivery"}>
    <button onClick={hundlerSearchDekivery} className='delivery-btn'>{t('search')}</button>
    {mapShow && start[0] !== 0 && (<div className="order-map">
    <MapContainer center={start} zoom={startOrder ? 17 : 13} style={{ height: "100%", width: "100%", zIndex: '0' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={start} icon={motorcycleIcon}>
            <Popup>🚖 موقع السائق</Popup>
        </Marker>
        {end[0] !== 0 && end[1] !== 0 && (
            <Marker position={end} icon={customIcon}>
                <Popup>📍 موقع المستخدم</Popup>
            </Marker>
        )}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
    </MapContainer>

    {startOrder ? 
        <button onClick={hundlerFinichOrder} 
        className="start">{t('finish')}</button>
    :
        <button onClick={hundlerStartOrder} 
        className="start">
        <i className="bi bi-arrow-right"></i> {t('start')}</button>}
    <div className={leftInformation ? "orders-container" : "orders-container-false"}>
      {informationOrder.map((items, index) => (
        <div key={index} className="store-section">
          <h1 className="name-service">{items.key}</h1>
          {items.value.map((item, index) => (
            <div key={index} className="order-card">
                <p className="delivery-title">{t('name')}: <span>{item.title}</span></p>
                <p className="delivery-count">{t('count')}: <span>{item.count}</span></p>
                <p className="delivery-price">{t('price')}: <span>{item.price}</span></p>
            </div>
          ))}
        </div>
      ))}
    <div className="totalPrice">{t('total')} {order.totalPrice}</div>
    </div>

    <button onClick={() => setLeftInformation(prev => !prev)}
     className={leftInformation ? "left-informtion" : "left-informtion-false"}>
        <i className="bi bi-justify-left"></i>
        </button>
      </div>
   )}
  </div>
  )
}

export default HomeDelivery