import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../image/logo.png';
import { useTranslation } from 'react-i18next';
import './fileCss/navbar.css';
import { toast } from 'react-toastify';

function Navbar({ setSearch, services, setServices, darkMode, setDarkMode }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(false);
  const [originalServices, setOriginalServices] = useState([]);
  const [isAr, setIsAr] = useState(true);

  useEffect(() => {
    if (originalServices.length === 0) {
      setOriginalServices([...services]);
      // i18n.changeLanguage('ar');
    }
  }, [services]);
  useEffect(() => {
    const currentLang = i18n.language || 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    setIsAr(currentLang === 'ar');
  }, []);
  useEffect(() => {
    console.log('Language changed:', i18n.language);
  }, [i18n.language]);
  
  const handleSearch = (query) => {
    if (query === '') {
      setSearch(false);
      setServices(originalServices);
      return;
    }
    setSearch(true);
    const filterServices = originalServices.filter((service) => 
      service?.title?.toLowerCase().includes(query.toLowerCase())
      // service?.location?.toLowerCase().includes(query.toLowerCase())
    );
    setServices(filterServices);
  };

  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
      setIsAr(lng === 'ar');
      toast.success(lng === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English');
    } catch (error) {
      console.error('Error changing language:', error);
      toast.error('Failed to change language');
    }
  }

  const changeDarkMode = () => {
    setDarkMode(prev => !prev)
    toast.success(darkMode ? t('dayMode') : t('darkMode'));
  }
  return (
    <div className={darkMode ? 'navbar-drk' : 'navbar'}>
      <div className="left">
        <img src={logo} alt="" className='logo'/>
        <Link to={
          user?.type === 'user' ? '/home'
          : user?.type === 'service' ? '/services'
          : '/delivery'
        } className='link home'><i className="bi bi-house-door"></i></Link>
        {user?.type === 'service' &&
        <Link to='/add' className='link'><i className="bi bi-plus-circle"></i> {t('addsr')}</Link>}
        {user?.isAdmin && <Link to='/admin' className='link'>
          <i className="bi bi-person-lock"></i>
        </Link>}
      </div>
      
      <div className="right">
      <div className="requiset">
            {user?.type === 'user' ? 
            <Link to='/cart'><i className="bi bi-bag"></i></Link>
           :
           <Link to={
            user?.type === 'service' ? '/order' : '/delivery-order'
           }><i className="bi bi-arrow-down-up"></i></Link>}
          </div>
        <button onClick={changeDarkMode} className='nav-btn'><i className="bi bi-moon"></i></button>
        {isAr ?
        <button onClick={() => changeLanguage('en')} className='nav-btn'><i className="bi bi-globe"></i> AR</button>
        :
        <button onClick={() => changeLanguage('ar')} className='nav-btn'><i className="bi bi-globe"></i> EN</button>}
        <input onChange={(e) => handleSearch(e.target.value)} type="search" placeholder={t('search')} className='nv-inp'/>
        <div onClick={() => setProfile(prev => !prev)} className='link'>{user?.image ?
          <img src={`http://localhost:5000${user.image}`} className='img-profile'/>
          : <i className="bi bi-person-circle"></i>}</div>
      </div>
      {profile && <div className={isAr ? "absoluteAr" : "absoluteEn"}>
        {user?.image ?
          <img src={`http://localhost:5000${user?.image}`} className='img-profile'/>
          : <i className="bi bi-person-circle"></i>}
        <Link to='/profile' onClick={() => {setProfile(false)}} className="name">{user?.name}</Link>
        <button onClick={() => {
          setProfile(false)
          localStorage.removeItem('user');
          navigate('/login');
        }}>{t('logout')}</button>
      </div>}
    </div>
  );
}

export default Navbar;
