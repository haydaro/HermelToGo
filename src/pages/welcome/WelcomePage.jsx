import React from 'react';
import { Link } from "react-router-dom";
import './welcome.css';
import beef from '../../image/beef.jpg';
import fastFood from '../../image/fast-food.jpg';
import oneDollar from '../../image/one-dollar.webp';
import markt from '../../image/markt.jpg';
import logo from '../../image/logoH.png';
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

function WelcomePage({ darkMode }) {
    const { t } = useTranslation();
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    };
  return (
    <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={{ duration: 0.5 }}
    >
    <div className={darkMode ? "home-container-dark" : "home-container"}>
      <header className="hero-section">
        <div className="hero-content">
          <img src={logo} alt="" />
          <h1>{t('Welcome-to')} HermelToGo</h1>
          <p>{t('WeDeliverEasily')}</p>
          <Link to="/register" className="cta-button">{t('startN')}</Link>
        </div>
      </header>

      <section className="categories-section">
        <h2>{t('WhatOffer')}</h2>
        <div className="categories">
          <div className="category">
            <img src={fastFood} alt="وجبات سريعة" />
            <h3>{t('food')}</h3>
          </div>
          <div className="category">
            <img src={beef} alt="لحوم ودواجن" />
            <h3>{t('MeatApoultry')}</h3>
          </div>
          <div className="category">
            <img src={oneDollar} alt="أجهزة كهربائية" />
            <h3>{t('last')}</h3>
          </div>
          <div className="category">
            <img src={markt} alt="" />
            <h3>{t('markt')}</h3>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>{t('why')} <span>HermelToGo</span>؟</h2>
        <p>{t('BecauseToHome')}</p>
      </section>

      <section className="contact-section">
        <h2>{t('ContactUs')}</h2>
        <div className="contact-buttons">
          <a href="tel:+96176449756" className="contact-button"><i class="bi bi-telephone"></i> {t('cme')}</a>
          <a href="https://wa.me/96176449756" className="contact-button whatsapp"><i className="bi bi-whatsapp"></i> {('whatsap')}</a>
        </div>
      </section>
    </div>
    </motion.div>
  )
}

export default WelcomePage