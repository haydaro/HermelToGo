import React from "react";
import { useNavigate } from "react-router-dom";
import './not-verification.css';

function NotVerification() {
    const navigate = useNavigate();
    
    const handleLogout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("address");
      navigate("/login");
    };
    
    return (
      <div className="not-verification-container">
        <div className="not-verification-card">
          <i className="bi bi-hourglass-split icon"></i>
          <h2>حسابك غير مفعل بعد!</h2>
          <p>
            شكرًا لتسجيلك لدينا! حسابك قيد المراجعة وسنقوم بتفعيله قريبًا.
            <br /> يرجى الانتظار حتى نتواصل معك في أقرب وقت.
          </p>
          <button onClick={handleLogout}>تسجيل الخروج</button>
        </div>
      </div>
    );
};    

export default NotVerification