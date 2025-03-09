import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./add-service.css"; // استيراد ملف الـ CSS

const OTPInput = ({ otp, setOtp, length, onComplete }) => {
  const inputsRef = useRef([]);

  useEffect(() => {
    if (otp.filter((num) => num !== "").length === length) {
      onComplete(otp.join("")); // إرسال الكود النهائي فقط عند الاكتمال
    }
  }, [otp]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // السماح فقط بالأرقام
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // انتقال تلقائي إلى الحقل التالي
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    return newOtp;
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="otp-container">
      {otp.map((_, index) => (
        <motion.input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          id={`otp-${index}`}
          type="text"
          maxLength="1"
          className="otp-input"
          value={otp[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileFocus={{ scale: 1.1, borderColor: "#3b82f6" }} // تأثير عند التركيز
          transition={{ type: "spring", stiffness: 120 }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
