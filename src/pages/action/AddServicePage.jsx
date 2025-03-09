import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './add-service.css';
import { useTranslation } from 'react-i18next';

function AddServicePage({ darkMode }) {
    const user = JSON.parse(localStorage.getItem('user'));
      const { t } = useTranslation();
    const navigate = useNavigate();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        price: '',
        image: null,
    });

    useEffect(() => {
        if (!user) return navigate('/login')
    }, [user, navigate]);

    const hundlerAddService = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            setError('')
            const data = new FormData()
            data.append('title', formData.title);
            data.append('category', user.service);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('image', formData.image);
            await axios.post('http://localhost:5000/api/services',
                data,
                { headers: { Authorization: `Bearer ${user.token}`,
                   'Content-Type': 'multipart/form-data' } }
            );
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch services.');
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className={darkMode ? 'add-service-drk' : 'add-service'}>
        {loading ?  <p className='loading'>Loading...</p>: 
                <form  onSubmit={hundlerAddService} className="form-add">
                <input type="text" placeholder={t('nOfSer')}
                value={formData.title} required
                onChange={(e) => setFormData({...formData, title: e.target.value})}/>
    
                <textarea type="text" placeholder={t('description')} required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}/>
    
                <input type="text" placeholder={t('price')} required
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})}/>
    
                <input type="file" placeholder={t('image')} required
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})}/>
                <button type="submit">{t('ad')}</button>
            </form>}
        {error && <p className='error'>{error}</p>}
    </div>
  )
}

export default AddServicePage