import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import { toast } from 'react-toastify'
import swal from 'sweetalert';
import OTPInput from "./OTPInput";

function RegisterPage({ darkMode }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: {
            locationName: '',
            city: '',
            floor: '',
            latitude:null,
            longitude:null
        },
        type: '',
        service: '',
        image: null,
    });

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [phone, setPhone] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [next, setNext] = useState(1);

    const [position, setPosition] = useState(null);

    const data = new FormData();

    const user = localStorage.getItem('user');
    const navigate = useNavigate();

    useEffect(() => {
        toast.info(t('يرجى اختيار ما نوع استعمالك لي hermelToGo'))
    }, []);

    const hundlernext = () => {
        if (!formData.type) {
            return toast.error(t('selectHermelToGo'));
        }
        toast.info(t('PleaseMap'))
        setError(null);
        setNext(2);     
    };

    const handlertype = (button) => {
        setFormData({ ...formData, type: button });
    };

    const hundlerLocationNext = () => {
        if (!formData.location.latitude || !formData.location.longitude) {
            return toast.error(t('PleaseMap'));
        }
        data.location = formData.location;
        toast.info('detailsLocation')
        setError(null);
        setNext(3);

        if (formData.type !== 'service') {
            setFormData(prev => ({ ...prev, service: 'user' }));
        }        
    };

    const hundlerInformationLocation = () => {
        if (!formData.location.locationName || !formData.location.city || !formData.location.floor) {
            return toast.error(t('detailsLocation'));
        }
        data.location = formData.location;
        
        setError(null);
        setNext(4);
        console.log(data);
        console.log(formData);

        if (formData.type !== 'service') {
            setFormData(prev => ({ ...prev, service: 'user' }));
        }        
    };

    const MapClickHandler = () => {
        useMapEvents({
          click: (e) => {
            setPosition([e.latlng.lat, e.latlng.lng]);
            setFormData((prev) => ({
                ...prev,
                location: {
                    locationName: '',
                    city: '',
                    floor: '',
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                }
            }));
            console.log(formData.location);
            console.log(position);
          },
        });
        return null;
      };
      const customIcon = new L.Icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        shadowSize: [41, 41]
    });
  const lastNext = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.service || !formData.location || !phone) {
        return toast.error('Please enter all required information');
    }
    console.log('append');
    try {
        await axios.post('http://localhost:5000/send-verification',
            { phone },
            { headers: { Authorization: `Bearer ${user.token}` } }
        );
    } catch (error) {
        toast.error(error.response?.data?.message)
        console.log(error);
    }
  };

  const sweetverify = (e) =>{
    e.preventDefault();
    swal({
      title: t("AreSure"),
      text: t("send-verifction"),
      icon: t("warning"),
      buttons: true,
      dangerMode: true,
    })
    .then((isOk) => {
      if (isOk) {
        lastNext();
        verifction();
        toast.info('we send to number code please tcheck end scrept her')
      }
    });
  };
  const handleRegister = async () => {
        try {
            setError(null);
            setLoading(true);
            const  response = await axios.post('http://localhost:5000/api/verification/verifi-phone',
                { code:otp, phone }
            );
            console.log(otp);
            
            if (response.data.message !== true) return toast.error(response.data.message);
            console.log(data);
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('service', formData.service);
            data.append('location', JSON.stringify(formData.location));
            data.append('type', formData.type);
            data.append('phone', phone);
            if (formData.image) data.append('image', formData.image);
            await axios.post('http://localhost:5000/api/auths/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(t('successfully-login'));
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed.')
            setError(error.response?.data?.message || 'Registration failed.');
            console.log(error.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };
  const verifction = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/verification/add-phone',
            { phone }
        );
        console.log(response);
        setNext(5);
    } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed.')
        setError(error.response?.data?.message || 'Registration failed.');
        console.log(error.response?.data?.message || 'Registration failed.');
    }
  };
    return (
        <div className={darkMode ? 'form-container-drk' : 'form-container'}>
            <div id="recaptcha-container"></div>
            { next === 1 ? 
            (
                <div className='next'>
                    <div className="one-next">
                    <button className={formData.type === 'user' ? 'type-active' : 'type'}
                        onClick={() => handlertype('user')}>
                            {t('user')}</button>
                        <button className={formData.type === 'service' ? 'type-active' : 'type'}
                        onClick={() => handlertype('service')}>
                            {t('service')}</button>
                        <button className={formData.type === 'delivery' ? 'type-active' : 'type'}
                        onClick={(e) => handlertype('delivery')}>
                            {t('delivery')}</button>
                    </div>
                    {error && <p className='error'>{error}</p>}
                    <button className='button-next' onClick={hundlernext}>{t('next')}</button>
                </div>
            ) : next === 2 ? 
            <div className="location-next">
        <MapContainer center={[34.396111111111, 36.3874]} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {position && <Marker position={[formData.location.latitude, formData.location.longitude]} icon={customIcon}/>}
      <MapClickHandler />
    </MapContainer>
    {/* <button onClick={getLocation}>{t('Accessmysite')}</button> */}
    <button className='button-next' onClick={hundlerLocationNext}>{t('next')}</button>
    </div>
    : next === 3 ?
    <div className="inputs-register">
        <h1 className='title-register-location'>
            {t('InformationLocation')}
        </h1>
        <input
        type="text" 
        placeholder={t('NameExample')} 
        value={formData.location.locationName} 
        onChange={(e) => setFormData({ 
                ...formData, 
                location: { ...formData.location, locationName: e.target.value }
        })} 
        required
       />
        <select 
        value={formData.location.city} 
        onChange={(e) => setFormData({ 
            ...formData, 
            location: { ...formData.location, city: e.target.value }
    })} 
        required
        className='input'>
        <option value="" disabled>{t('area')}</option>
        <option value="dawra">دورة</option>
        <option value="sabil">سبيل</option>
        <option value="mrh">مرح</option>
        <option value="mansora">المنصورة</option>
        <option value="tall">التل</option>
        <option value="tallFar">تلال الفار</option>
        <option value="maalak">المعلقة</option>
        </select>
       <input 
       type="text" 
       placeholder="Floor" 
       value={formData.location.floor} 
       onChange={(e) => setFormData({ 
              ...formData, 
              location: { ...formData.location, floor: e.target.value }
       })} 
       required
       />

    <button className='button-next' onClick={hundlerInformationLocation}>{t('next')}</button>
        </div>
            : next === 4 ? (
                <div className='form-input'>
                <form className="form" onSubmit={sweetverify}>
                    <input 
                        type="text" 
                        placeholder={t("name")} 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input 
                        type="email" 
                        placeholder={t("email")} 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder={t("password")} 
                        value={formData.password} 
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <input
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="رقم الهاتف" 
                    // pattern="[0-7]{8}" 
                    required 
                    // maxlength="8" 
                    // minlength="8"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    />
                    {formData.type === 'service' && <select 
                        value={formData.service} 
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        required
                        className='input'>
                        <option value="" disabled>{t('selectS')}</option>
                        <option value="food">{t('food')}</option>
                        <option value="vegetable">{t('Vegetable')}</option>
                        <option value="supermarket">{t('markt')}</option>
                        <option value="dollar">{t('dollar')}</option>
                    </select>}
                    <input 
                        type="file" 
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    />
                    {error && <p className='error'>{error}</p>}
                    <button className='button-next' type="submit">{t('next')}</button>
                </form>
                </div>
            )
            : next === 5 &&     <div className="veri-content">
            <h2 className="very-title">أدخل رمز التحقق</h2>
            <p className="very-message">لقد أرسلنا رمز تحقق إلى هاتفك</p>
            <OTPInput otp={otp} setOtp={setOtp} length={6} onComplete={handleRegister} />
          </div>
            }
            <p className='to-login'>{t('IHAc')} .<Link className='link' to='/login'> {t('login')}</Link></p>
        </div>
    );
}

export default RegisterPage;
