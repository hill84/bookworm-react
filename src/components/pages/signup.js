import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../forms/signupForm';

const Signup = () => (
    <div className="card-container" id="signupComponent">
        <h2>Registrati</h2>
        <div className="card">
            <SignupForm />
        </div>
        <div className="sub-footer">Hai già un account? <Link to="/login">Accedi</Link></div>
    </div>
);

export default Signup;