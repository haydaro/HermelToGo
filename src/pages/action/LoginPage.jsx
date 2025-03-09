import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage({ darkMode }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useTranslation();
    const [error, seterror] = useState(null);
    const [loadings, setloading] = useState(false);

    const user = localStorage.getItem('user');
    const navigate = useNavigate();

    useEffect(() => {
    }, [user, navigate]);

    const hundlerlogin = async (e) => {
        e.preventDefault();
        try {
            if (!email || !password) {
                seterror('Please Enter Email And Password');
                return;
            }
            seterror(null);
            setloading(true);
            const { data } = await axios.post('http://localhost:5000/api/auths/login',
                { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('address', JSON.stringify(data.location[0]));
            
            data.type === 'user' ? navigate('/home')
            : data.type === 'delivery' ? navigate('/delivery')
            : navigate('/services')
        } catch (error) {
            seterror(error.response?.data?.message);
        } finally {
            setloading(false);
        }
    }

  return (
    <div className={darkMode ? 'form-container-drk' : 'form-container'}>
        {loadings ? <div className='loading'>
            loading...
        </div> :<div className='form-input'>
            <h1 className='form-title'>{t('login')}</h1>
                <form onSubmit={hundlerlogin} className="form">
                <input type="email" value={email} placeholder={t('email')}
                onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" value={password} placeholder={t('password')}
                onChange={(e) => setPassword(e.target.value)}/>
                {error && <p className='error'>{error}</p>}
                <button type="submit">{t('login')}</button>
            </form>
            <p className='to-register'>{t('IDHAc')}<Link className='link' to='/register'>{t('Register')}</Link></p>
            </div>}
    </div>
  )
}

export default LoginPage