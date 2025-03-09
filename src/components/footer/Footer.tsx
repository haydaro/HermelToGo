import React from 'react';
import './footer.css';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
        <footer className="footer">
          <div className="footer-container">
            {/* معلومات الشركة */}
            <div className="footer-section">
              <h2 className="footer-title">HermelTogo</h2>
              <p className="footer-text">
              {t('Aexperience')}
              </p>
            </div>
    
            {/* الروابط السريعة */}
            <div className="footer-section">
              <h3 className="footer-title">{t('Quick-Links')}</h3>
              <ul className="footer-links">
                <li><Link to="/">{t('home')}</Link></li>
                <li><Link to="/home">{t('servs')}</Link></li>
                <li><Link to="/about">{t('wAre')}</Link></li>
              </ul>
            </div>
    
            {/* وسائل التواصل الاجتماعي */}
            <div className="footer-section">
              <h3 className="footer-title">{t('follow')}</h3>
              <div className="footer-social">
                <a href="#"><i className="bi bi-facebook"></i></a>
                <a href="#"><i className="bi bi-instagram"></i></a>
                <h3 className="footer-title">{t('call')}</h3>
                <a href="https://wa.me/76449756"><i className="bi bi-whatsapp"></i></a>
                <a href="tel:+96176449756">76 449 756</a>

              </div>
            </div>
          </div>
    
          {/* حقوق النشر */}
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} HermelTogo - {t('AllRreserved')}</p>
          </div>
        </footer>
    
  )
}

export default Footer