import React, { useEffect, useState } from 'react';
import ImageSlider from './Slider';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './home-page.css';
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import ContentLoader from "react-content-loader";

function HomePage({ search, services, setServices, darkMode }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [servicesAuth, setServicesAuth] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
      const fetchAuthService = async () => {
        try {
          setLoading(true)
          const { data } = await axios.get('http://localhost:5000/api/auths/service', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setServicesAuth(data);
        } catch (error) {
          setError(error.response?.data?.message || 'Failed to fetch auth services.');
        }finally{
          setLoading(false)
        }
      };
  
      const fetchService = async () => {
        try {
          setLoading(true)
          const { data } = await axios.get('http://localhost:5000/api/services', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setServices(data);
        } catch (error) {
          setError(error.response?.data?.message || 'Failed to fetch services.');
        } finally {
          setLoading(false);
        }
      };
      fetchService();
      fetchAuthService();
  }, []);

  const filterServices = (title, category) => {
    const serviceFilter = services.filter(ser => ser.category === category);
    return (
      <div className="one">
        <div className="more">
          <p>{title}</p>
          <Link to={`/${category}`}>{t('more')}</Link>
        </div>
        <div className="content">
          {serviceFilter.map((ser) => (
            <Link to={`/service/${ser._id}`} key={ser._id} className='link'>
              <img src={`http://localhost:5000${ser.image}`} alt="" />
              <h1 className="title">{ser.title}</h1>
              <p className="description">{ser.description}</p>
              <span className="price">{ser.price}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  };
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const ServiceSkeleton = () => (
    <ContentLoader
      speed={2}
      width={300}
      height={180}
      viewBox="0 0 300 180"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="10" y="10" rx="8" ry="8" width="100%" height="100" />
      <rect x="10" y="120" rx="4" ry="4" width="70%" height="15" />
      <rect x="10" y="145" rx="4" ry="4" width="50%" height="12" />
    </ContentLoader>
  );

  const AuthServiceSkeleton = () => (
    <ContentLoader
      speed={2}
      width={250}
      height={300}
      viewBox="0 0 250 300"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="10" ry="10" width="250" height="140" />
      <rect x="10" y="160" rx="4" ry="4" width="70%" height="20" />
      <rect x="10" y="190" rx="4" ry="4" width="90%" height="15" />
      <rect x="10" y="220" rx="4" ry="4" width="40%" height="15" />
    </ContentLoader>
  );  

  return (
    search ? 
    <div className="search-container">
    <div className={darkMode ? 'search-dark' : 'search'}>
      {services.map(ser => (
        <Link key={ser._id} to={`/service/${ser._id}`} className='link'>
          <img src={`http://localhost:5000${ser.image}`} alt="" />
          <h1>{ser.title}</h1>
          <p>{ser.price}</p>
        </Link>
      ))}
    </div>
    </div>
    :
<motion.div
  initial="initial"
  animate="animate"
  exit="exit"
  variants={pageVariants}
  transition={{ duration: 0.5 }}
>
  <div className={darkMode ? "home-page-dark" : "home-page"}>
    {/* ✅ عرض Skeleton أثناء تحميل الصور */}
    {loading ? <ServiceSkeleton /> : <ImageSlider darkMode={darkMode} />}

    {error ? (
      <p className="error">{error}</p>
    ) : (
      <div className="containeri">
        {loading ? (
          // ✅ عرض الهيكل العظمي للخدمات أثناء تحميل البيانات
          <>
            <ServiceSkeleton />
            <ServiceSkeleton />
            <ServiceSkeleton />
            <ServiceSkeleton />
          </>
        ) : (
          <>
            {filterServices(t("Vegetable"), "vegetable")}
            {filterServices(t("dollar"), "dollar")}
            {filterServices(t("markt"), "supermarket")}
            {filterServices(t("food"), "food")}
          </>
        )}

        <div className="one">
          <div className="more">
            <p>{t("services")}</p>
            <Link to={"/auth-services"}>{t("more")}</Link>
          </div>

          <div className="content">
            {loading ? (
              // ✅ عرض الهيكل العظمي لقائمة الخدمات المصادق عليها
              <>
                <AuthServiceSkeleton />
                <AuthServiceSkeleton />
                <AuthServiceSkeleton />
              </>
            ) : (
              servicesAuth?.map((ser) => (
                <Link to={`/auth/profile/${ser._id}`} key={ser._id} className="link">
                  <img src={`http://localhost:5000${ser.image}`} alt="" />
                  <h1 className="title">{ser.title}</h1>
                  <p className="description">{ser.description}</p>
                  <span className="price">{ser.price}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</motion.div>

  );
}

export default HomePage;
