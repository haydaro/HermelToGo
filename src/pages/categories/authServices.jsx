import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './category.css';

function AuthServices({ darkMode }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [error, setError] = useState('');
    const [auths, setAuths] = useState([]);
    const navigate = useNavigate();


  useEffect(() => {
    const fetchService = async () => {
        if (!user) {
            navigate('/login');
          }
            try {
              const { data } = await axios.get('http://localhost:5000/api/auths/service', {
                headers: { Authorization: `Bearer ${user.token}` }
              });
              setAuths(data);
            } catch (error) {
              setError(error.response?.data?.message || 'Failed to fetch auth services.');
            }
        }
    fetchService();
  }, []);

  return (
    <div className={darkMode ? "dark-mode" : "non"}>
    <div className='category'>
      {auths.map((ser) => (
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

export default AuthServices