import React from 'react';
import {provider, authG } from './firebase';
import { useNavigate } from 'react-router-dom';
import Gicon from '../assets/google.png'
import { signInWithPopup } from 'firebase/auth';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
function Login() {
    const navigate = useNavigate();
    if (cookies.get('auth-token')) {
        navigate('home');
    }

    const GLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await signInWithPopup(authG, provider);
            console.log(res);
            cookies.set("auth-token", res._tokenResponse.refreshToken);
            alert('Login success')
            navigate('home')
        }
        catch (error) {
            console.log(error);
            alert(error);
        }

    }

    return (
        <>
            <button className='mb-4 mx-5 w-100 rounded-2' onClick={GLogin}>
                <img className='img-thumbnail' style={{ width: '3rem', height: '3rem' }} src={Gicon} alt='....' />
                Sign In with Google</button>
        </>
    );
}

export default Login;