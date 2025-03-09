import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

function AdminDashbord() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [auths, setAuths] = useState([]);
    const [services, setServices] = useState([]);
    const [show, setShow] = useState([]);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                if (!user || !user.isAdmin) return navigate('login');
                const { data } = await axios.get('http://localhost:5000/api/auths',
                    { headers: { Authorization: `Bearer ${user.token}` } });
                setAuths(data.users);
                console.log(data);
                setServices(data.services);
            } catch (error) {
            setError(error.response?.data?.message);
            }
        }
        fetchAdmin();
    }, []);

    const hundlerDeleteService = async (id) => {
        try {
          const respons = await axios.delete(`http://localhost:5000/api/services/${id}`,
            { headers: { Authorization: `Bearer ${user.token}` } });
          console.log(respons);
        } catch (error) {
          setError(error.response?.data?.message);
        }
      };

  return (
    <div className='admin'>
        <div className="left">
            <button onClick={() => setShow(true)} className="auths">Auth</button>
            <button onClick={() => setShow(false)} className="services">Services</button>
        </div>
        <div className="informtion">
            {show ? 
            <div className='auth'>
                {auths?.map((auth) => (
                    <Link key={auth._id} className='link'>
                        <span><img src={`http://localhost:5000${auth.image}`} alt="" />{auth.name}</span>
                        <span>{auth.email}</span>
                        <span>{auth.type}</span>
                        <span>{auth.location}</span>
                    </Link>
                ))}
            </div>: 
            <div className='services'>
                {services.map((service) => (
                    <Link key={service._id} className='link'>
                        <span><img src={`http://localhost:5000${service.image}`} alt="" />{service.title}</span>
                        <span>{service.category}</span>
                        <span>{service.price}</span>
                        <button onClick={() => hundlerDeleteService(service._id)}>Delete</button>
                    </Link>
                ))}
            </div>}
        </div>
    </div>
  )
}

export default AdminDashbord