import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import './fileCss/test.css';
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// إعداد أيقونة مخصصة للعلامات
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
const GraphHopperMap = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const id = JSON.parse(localStorage.getItem('order'));
    const address = JSON.parse(localStorage.getItem('address'));

    const [route, setRoute] = useState([]);
    const [start, setStart] = useState([0, 0]); // موقع السائق
    const end = [address.latitude, address.longitude]; // موقع المستخدم
    const apiKey = '7e42b8e2-47f0-4cdc-88f2-5a4fc78c9ab0'; // ضع مفتاح API الخاص بك هنا

    const [order, setOrder] = useState(null);
    const [leftInformation, setLeftInformation] = useState(true);

    useEffect(() => {
        setInterval(() => {
            const fetchRoute = async () => {
                try {
                    const respons = await axios.get(`http://localhost:5000/api/order/${id}`,
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                    if(respons.data.message === false) {
                        localStorage.removeItem('order');
                        navigate('/home');
                        return;
                    };
                    console.log(respons);
                    
                    setStart([respons.data.latitude, respons.data.longitude]);
                    
                const url = `https://graphhopper.com/api/1/route?point=${respons.data.latitude},${respons.data.longitude}&point=${end.join(",")}&vehicle=car&locale=en&key=${apiKey}&points_encoded=false`;
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data.paths && data.paths.length > 0) {
                        setRoute(data.paths[0].points.coordinates.map(coord => [coord[1], coord[0]]));
                    }
                } catch (error) {
                    console.error("❌ خطأ في جلب المسار:", error);
                    console.log(error);
                }
            };
        fetchRoute();
        }, 5000);
    }, []);

    useEffect(() => {
        const getOrder = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/order/info-order',
                    { headers: { Authorization: `Bearer ${user.token}` } }
                )
                if (data.message === false) return navigate('/');
                setOrder(data);
                console.log(data);
                
            } catch (error) {
                console.error(error);
                console.log(error);
            }
        }
        getOrder();
    }, [])

    return (
        <div className="map-user">
    <div className={leftInformation ? "orders-container" : "orders-container-false"}>
      {order && order?.informationOrder.map((items, index) => (
        <div key={index} className="store-section">
          <h1 className="name-service">{items?.key}</h1>
          {items?.value?.map((item, index) => (
            <div key={index} className="order-card">
                <p className="delivery-title">{t('name')}: <span>{item.title}</span></p>
                <p className="delivery-count">{t('count')}: <span>{item.count}</span></p>
                <p className="delivery-price">{t('price')}: <span>{item.price}</span></p>
            </div>
          ))}
        </div>
      ))}
      <div className="totalPrice">{t('total')}: {order?.totalPrice} $</div>
    </div>
    <button onClick={() => setLeftInformation(prev => !prev)}
     className={leftInformation ? "left-informtion" : "left-informtion-false"}>
        <i className="bi bi-justify-left"></i>
        </button>
            {start[0] !== 0 && <MapContainer center={start} zoom={13} style={{ height: "100%", width: "100%", zIndex: '5'}}>
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
    </MapContainer>}
        </div>
    );
};

export default GraphHopperMap;
