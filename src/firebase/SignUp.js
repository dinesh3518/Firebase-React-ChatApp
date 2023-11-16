import React, { useState } from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput
}
    from 'mdb-react-ui-kit';
import { auth } from './firebase';
import { useNavigate,Link } from 'react-router-dom';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            alert("Account successfully created");
            navigate('/');
        }
        catch (error) {
            console.log(error);
            alert(error);
        }

    }

    return (
        <MDBContainer fluid>
            <MDBRow className='vh-100'>

                <MDBCol sm='8' className='border m-2'>

                    <div className='d-flex flex-row ps-5 pt-5'>
                        <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }} />
                    </div>

                    <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

                        <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Sign Up</h3>

                        <MDBInput wrapperClass='mb-4 mx-5 w-100' onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            label='Email address' id='formControlLg' type='email' size="lg" />
                        <MDBInput wrapperClass='mb-4 mx-5 w-100' onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            label='Password' id='formControlL' type='password' size="lg" />

                        <button className='btn btn-success mb-4 mx-5 w-100 ' onClick={handleLogin}>Sign up</button>
                        <p className='ms-5'>Already have an account? <Link to={'/'}>Sign in</Link></p>
                    </div>

                </MDBCol>
            </MDBRow>

        </MDBContainer>
    );
}

export default SignUp;