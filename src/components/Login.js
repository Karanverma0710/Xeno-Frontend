import React from 'react';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import './Login.css'; 
import { toast } from 'react-toastify';

const Login = ({ onLogin }) => {
  const handleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        onLogin(result.user);
        auth.currentUser
          .getIdToken()
          .then((token) => {
            console.log('Firebase Token:', token);
            localStorage.setItem('firebaseToken', token);
          })
          .catch((error) => {
            console.error('Error fetching Firebase token:', error);
            toast.error('Failed to fetch Firebase token.');
          });
      })
      .catch(error => {
        console.error('Error logging in:', error);
        toast.error('Failed to log in. Please try again.');
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome to MyCRM</h1>
        <p>Sign in to access your dashboard</p>
        <button className="google-login-button" onClick={handleLogin}>
          <img src="https://www.svgrepo.com/show/243086/google.svg" alt="Google Icon" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
