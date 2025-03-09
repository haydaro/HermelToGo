import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import './category.css';

function Food({ darkMode }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const [error, setError] = useState('');
  const [Food, setFood] = useState([]);

useEffect(() => {
  const fetchService = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/services', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFood(data.filter(ser => ser.category === 'services'));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch services.');
    }
  };
  fetchService();
}, [])
return (
  <div className={darkMode ? "dark-mode" : "non"}>
  <div className='category'>
              {Food.map((ser) => (
          <Link to={`/service/${ser._id}`} key={ser._id} className='link'>
            <img src={`http://localhost:5000${ser.image}`} alt="" />
            <h1 className="title">{ser.title}</h1>
            <p className="description">{ser.description}</p>
            <span className="price">{ser.price}</span>
          </Link>
        ))}
  </div>
  </div>
)
}

export default Food