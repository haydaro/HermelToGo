import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import axios from 'axios';
import photo from '../image/user.png';
import { useTranslation } from 'react-i18next';
import './fileCss/profile.css';
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import ContentLoader from "react-content-loader";
import { motion } from "framer-motion";

function Profile({darkMode}) {
  
    const user = JSON.parse(localStorage.getItem('user'));
    const locationadd = JSON.parse(localStorage.getItem('address'));
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [update, setupdate] = useState(false);
    const [updateServiceform, setupdateServiceForm] = useState(false);

    const [location, setLocation] = useState({
      floor: null,
      city: null,
      locationName: null,
      latitude: null,
      longitude: null,
    });
    const [apdateLocation, setApdateLocation] = useState(false);
    const [address, setAddress] = useState(locationadd?.locationName);
    const [addLocation, setAddLocation] = useState(false);

    const [auth, setauth] = useState([]);
    const [services, setservice] = useState([]);
    const [saved, setSaved] = useState([]);

    const [formData, setFormData] = useState({
      name: user.name,
      email: user.email,
      password: user.password,
      location: user.location,
      type: user.type,
      service: user.service,
      image: null,
    });

    const [formDataService, setFormDataService] = useState({
      id: null,
      category: '',
      title: '',
      description: '',
      price: '',
      image: null,
    });

    useEffect(() => {
            const fetchprofile = async () => {
          try {
            setError('');
            setLoading(true);
            const {data} = await axios.get('http://localhost:5000/api/auths/profile',
              { headers: { Authorization: `Bearer ${user.token}` } });
              data.user ? setauth(data.user) : setauth(data);
              
              data.service !== 'undefined' | 'user' && setservice(data.service);              
          } catch (error) {
            setError(error.response?.data?.message);
            toast.error(error.response?.data?.message);
            console.log(error);
          } finally {
            setLoading(false);
          }
          };
          
          const fetchAuthSaved = async () => {
            try {
              const { data } = await axios.get('http://localhost:5000/api/auths/profile/save',
                { headers: { Authorization: `Bearer ${user.token}` } }
              );
              setSaved(data)
            } catch (error) {
            setError(error.response?.data?.message);
            toast.error(error.response?.data?.message);
            }
          };
          fetchAuthSaved();
          fetchprofile();
    }, []);

    const hundlerUpdateProfile = async (e) => {
      e.preventDefault();
      try {
        setError('');
        setLoading(true);
        setupdate(false);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('service', formData.service);
        data.append('image', formData.image);

        const response = await axios.put('http://localhost:5000/api/auths',
          data,
          {headers: { Authorization: `Bearer ${user.token}`,
              'Content-Type': 'multipart/form-data' }}
        );
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log(JSON.stringify(response.data));
      } catch (error) {
        setError(error.response?.data?.message);
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    const hundlerDeleteProfile = async () => {
      try {
        axios.delete('http://localhost:5000/api/auths',
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        navigate('/login');
        localStorage.removeItem('user')
      } catch (error) {
        setError(error.response?.data?.message);
        toast.error(error.response?.data?.message);
      }
    };
    const sweetDeleteProfile = () =>{
      swal({
        title: t("AreSure"),
        text: t("deletedProfile"),
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((isOk) => {
        if (isOk) {
          hundlerDeleteProfile();
        }
      });
    };

    const updateService = (service) => {
        setFormDataService({
          id: service._id,
          category: service.category,
          title: service.title,
          description: service.description,
          price: service.price,
          image: null,
        });
        setupdateServiceForm(true);
    };
    const hundlerUpdateService = async (e) => {
      try {
        const data = new FormData();
        data.append('id', formDataService.id);
        data.append('category', formDataService.category);
        data.append('title', formDataService.title);
        data.append('description', formDataService.description);
        data.append('price', formDataService.price);
        if (formDataService.image) data.append('image', formDataService.image);
        await axios.put('http://localhost:5000/api/services',
          data,
          { headers: { Authorization: `Bearer ${user.token}`,
                'Content-Type': 'multipart/form-data' } });
          alert('service edit successfully');
      } catch (error) {
        setError(error.response?.data?.message);
        toast.error(error.response?.data?.message);
      }
    };
    const hundlerDeleteService = async (id) => {
      try {
        const respons = await axios.delete(`http://localhost:5000/api/services/${id}`,
          { headers: { Authorization: `Bearer ${user.token}` } });
        console.log(respons);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };
    const sweetDeleteService = (id) =>{
      swal({
        title: t("AreSure"),
        text: t("deletedProfile"),
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((isOk) => {
        if (isOk) {
          hundlerDeleteService(id);
        }
      });
    };
    
    const hundlerAddLocation = async (loctionN) => {
      try {
        const updateUser = user;
        if(loctionN) {
          if(user.location.length === 1) return toast.error('you dount have location');
          const updatelocation = user.location.filter(loci => loci.locationName !== loctionN);          
          await axios.put('http://localhost:5000/api/auths/location',
            { location:updatelocation },
            {headers: { Authorization: `Bearer ${user.token}` }}
          )
            updateUser.location = updatelocation;
            localStorage.setItem('user', JSON.stringify(updateUser));
            setauth(updatelocation);
            toast.success('location has deleted')
            return;
        }
        
        if(user.location.length === 3) {
          setAddLocation(false);
          return toast.error('maxsimum adit three');
        }
        const existLocation = user.location.filter(loc => loc.locationName === location.locationName);
        
        if (existLocation.length > 0) return toast.error('you have this location name');
        if (!location.latitude || !location.longitude) return toast.error(t('PleaseMap'))
        if (!location.city || !location.floor || !location.locationName) return toast.error(t('detailsLocation'))
        updateUser.location = [...user.location, location];
          await axios.put('http://localhost:5000/api/auths/location',
            { location: updateUser.location },
            {headers: { Authorization: `Bearer ${user.token}` }}
          );
          setAddLocation(false);
          localStorage.setItem('user', JSON.stringify(updateUser));
          toast.success(t('LocationAdded'))
      } catch (error) {
        setError(error.response?.data?.message);
        toast.error(error.response?.data?.message);
        console.log(error);
      }
    };
    const setaddresslocation = (locName) => {
      localStorage.setItem('address', JSON.stringify(locName));
      toast.warning(t('TheChanged'))
      setAddress(locName.locationName);
    };
    const MapClickHandler = () => {
        useMapEvents({
          click: (e) => {
            setLocation({...location,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
            });
            console.log(formData.location);
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
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    };

const ProfileSkeleton = () => (
      <ContentLoader
        speed={2}
        width={"100%"}
        height={"100vh"}
        viewBox="0 0 400 600"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        {/* صورة البروفايل */}
        <rect x="150" y="20" rx="10" ry="10" width="100" height="100" />
        {/* أيقونة التعديل */}
        <rect x="230" y="100" rx="5" ry="5" width="20" height="20" />
  
        {/* الاسم */}
        <rect x="130" y="140" rx="4" ry="4" width="140" height="15" />
        
        {/* الموقع */}
        <rect x="100" y="170" rx="4" ry="4" width="200" height="15" />
        <rect x="120" y="195" rx="4" ry="4" width="160" height="12" />
  
        {/* زر حذف الحساب */}
        <rect x="110" y="230" rx="5" ry="5" width="180" height="35" />
      </ContentLoader>
    );

    return (
      error ? <p className='error'>{error}</p> :
      loading ? <ProfileSkeleton/> :
      <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      >
      <div className="profile-con">
              <div className={darkMode ? 'auth-dark' : 'auth'}>
        <div className='profile'>
          <div className="img">
            <img src={user?.image ? `http://localhost:5000${auth?.image}` : photo} alt="" />
            <button onClick={() => setupdate(true)}><i className="bi bi-pencil-square"></i></button>
          </div>
          <div className="information">
            <div className="left">
            <div className="name">{t('name')}: {auth?.name}</div>
            {user.type !== 'delivery' &&
            <div className="loaction">
              {t('location')}: 
              <div className="location-informition">
                <div className="location-active">
                <p>{locationadd?.locationName}</p>
                <span>{locationadd?.city}, {locationadd?.floor}</span>
                </div>
                <button onClick={() => setApdateLocation(true)} className="btn-update-location">
                <i className="bi bi-caret-down-fill"></i>
              </button>
              </div>
            </div>}
            <button className='up-profile' onClick={sweetDeleteProfile}>{t('dltprofile')}</button>
            </div>
          </div>
          </div>
          <div className="serviceAuth">
            {services && user.type !== 'delivery' && services?.map((ser) => (
              <div key={ser._id} className='to-go'>
                <div className="image">
                <div className="updateanddelete">
                  <button onClick={() => updateService(ser)} className='update'>{t('update')}</button>
                  <button onClick={() => sweetDeleteService(ser._id)} className='delete'>{t('delete')}</button>
                </div>
                <img src={`http://localhost:5000${ser?.image}`} alt="" />
                </div>
                <Link to={`/service/${ser._id}`}>
                <div className="down">
                  <div className="title">{t('name')}: {ser.title}</div>
                  <div className="price">{t('price')}: {ser.price}</div>
                </div>
                </Link>
              </div>
            ))}
          </div>
          {update && <div className='apdate'>
            <button onClick={() => setupdate(false)}><i className="bi bi-x-lg"></i></button>
            <form onSubmit={hundlerUpdateProfile} className="form-update">
              <input type="text" placeholder='name' value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>

              <input type="email" placeholder='Email' value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>

              <input type="password" placeholder='password' value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>

              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service:e.target.value })}>
                  <option value="" disabled>Select service</option>
                  <option value="Food">Fast Food</option>
                  <option value="supermarket">Supermarket</option>
                  <option value="dollar">One Dollar</option>
                </select>
              <input type="file" placeholder='image'
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}/>
              <button className='button' type="submit">Update</button>
            </form>
            </div>}
            {updateServiceform && <div className='apdate'>
            <button onClick={() => setupdateServiceForm(false)}><i className="bi bi-x-lg"></i></button>
            <form onSubmit={hundlerUpdateService} className="form-update">
              <input type="text" placeholder='title' value={formDataService.title}
              onChange={(e) => setFormDataService({ ...formDataService, title: e.target.value })}/>

              <input type="text" placeholder='description' value={formDataService.description}
              onChange={(e) => setFormDataService({ ...formDataService, description: e.target.value })}/>

              <input type="text" placeholder='price' value={formDataService.price}
              onChange={(e) => setFormDataService({ ...formDataService, price: e.target.value })}/>

              <select
                value={formDataService.category}
                onChange={(e) => setFormDataService({ ...formDataService, category:e.target.value })}>
                    <option value="" disabled>Select Category</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="dollar">One Dollar</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="services">Service</option>
                </select>
              <input type="file" placeholder='image'
              onChange={(e) => setFormDataService({ ...formDataService, image: e.target.files[0] })}/>
              <button className='button' type="submit">Update</button>
            </form>
            </div>}
            {apdateLocation && 
            <div className="update-location">
              {addLocation && <div className="add-location">
                <input type="text" placeholder='floor' value={location.floor} required
                onChange={(e) => setLocation({...location, floor: e.target.value})}/>
                <input type="text" placeholder='city' value={location.city} required
                onChange={(e) => setLocation({...location, city: e.target.value})}/>
                <input type="text" placeholder='home,jop,office...' value={location.locationName} required
                onChange={(e) => setLocation({...location, locationName: e.target.value})}/>

              <MapContainer center={[34.396111111111, 36.3874]} zoom={13} style={{ height: "200px", width: "370px" }}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {location.latitude && <Marker position={[location.latitude, location.longitude]} icon={customIcon}/>}
                <MapClickHandler />
              </MapContainer>
              
                <button onClick={() => hundlerAddLocation(false)}>{t('add-location')}</button>
            </div>}

              <button onClick={() => {
                setApdateLocation(false)
                setAddLocation(false)
              }} className="back">
                <i className="bi bi-arrow-bar-left"></i></button>

                {user.location.map((loc, index) => (
              <div key={index} className="address">
                <input type="radio"checked={address === loc.locationName} 
                onChange={() => setaddresslocation(loc)}/>
                <div className="name">{loc?.locationName}
                  <p>{loc?.city},{loc?.floor}</p>
                  <p></p>
                </div>
                <button onClick={() => hundlerAddLocation(loc.locationName)}>{t('delete')}</button>
              </div>
                ))}
          <button onClick={() => setAddLocation(true)}><i className="bi bi-geo-alt"></i> {t('add-location')}</button>
            </div>}
            {user.type === 'user' ? 
              saved ? 
                <div className='saved'>
                  <i className="bi bi-bookmark-fill icon"></i>
                  <div className="saves">
                  {saved?.map((sav) => (
                    <Link to={`/auth/profile/${sav._id}`} key={sav._id}>
                      <img src={`http://localhost:5000${sav.image}`} alt="" />
                      <div className="text">
                        <p className="name">{sav.name}</p>
                        <p className="name">{sav.location[0].locationName}</p>
                      </div>
                    </Link>
                  ))}
                  </div>
                </div> :
                <div className='no-save'>no save found</div>: null}
      </div>
      </div>
      </motion.div>
    )
}

export default Profile;