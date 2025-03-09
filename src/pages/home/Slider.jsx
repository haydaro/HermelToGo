import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import slider1 from '../../image/slider1.jpg';
import slider2 from '../../image/slider2.jpg';
import slider3 from '../../image/slider3.jpg';

function ImageSlider({darkMode}) {
  const settings = {
    dots: true, // لإظهار النقاط في الأسفل
    infinite: true, // لجعل السلايدر يدور بشكل لا نهائي
    speed: 500, // سرعة الانتقال بين الشرائح
    slidesToShow: 1, // عدد الشرائح التي تظهر في وقت واحد
    slidesToScroll: 1, // عدد الشرائح التي يتم تمريرها عند كل نقرة
    autoplay: true, // التمرير التلقائي
    autoplaySpeed: 3000 // سرعة التمرير التلقائي (بالميلي ثانية)
  };

  return (
    <div className={darkMode ? 'container-drk' :'container'}>
      <div className="slider">
      <Slider {...settings}>
        <div>
          <img src={slider1} alt='Slider 1' />
        </div>
        <div>
          <img src={slider2} alt='Slider 2' />
        </div>
        <div>
          <img src={slider3} alt='Slider 3' />
        </div>
      </Slider>
      </div>
    </div>
  );
}

export default ImageSlider;
