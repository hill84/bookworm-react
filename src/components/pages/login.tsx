import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { app } from '../../config/shared';
import { LocationType } from '../../types';
import LoginForm from '../forms/loginForm';

interface LoginProps {
  location: LocationType;
}

const Login: FC<LoginProps> = ({ location }: LoginProps) => (
  <div className='card-container pad-v' id='loginComponent'>
    <Helmet>
      <title>{app.name} | Login</title>
      <link rel='canonical' href={app.url} />
    </Helmet>
    <h2>Login</h2>
    <div className='card light'>
      <LoginForm location={location} />
    </div>
    <Link to='/password-reset' className='sub-footer'>Non ricordi la password?</Link>
  </div>
);

export default Login;