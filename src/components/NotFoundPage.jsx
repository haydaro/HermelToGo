import React from 'react'
import { Link } from "react-router-dom";
import './fileCss/not-found.css'
function NotFoundPage({ darkMode }) {
  const user = JSON.parse(localStorage.getItem('user'))
    return (
      <div className={darkMode ? "dark-moud" : "no-dark-moud"}>
      <div className="no-found-page">
        <h1 className="status">404</h1>
        <p className="text-not-found">عذرًا، الصفحة غير موجودة!</p>
        
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="Page Not Found"
          className="img-not-found"
        />
  
        <Link
          to={user?.type === 'user' ? "/" :
              user?.type === 'delivery' ? "/delivery"
             :user?.type === 'service' ? "/services" :
              "/login"
          }
          className="go-to-home"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
      </div>
    );
  };

export default NotFoundPage