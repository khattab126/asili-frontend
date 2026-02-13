import React, { useContext, useState, useEffect } from 'react';
import '../style/Login.css';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const OnSubmitHandler = async (event) => {
    event.preventDefault();
  
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password
        });
  
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Account created successfully");
        } else {
          // Handling specific error for "User already exists"
          if (response.data.message === 'User already exists with this email') {
            toast.error("An account already exists with this email");
          } else {
            toast.error(response.data.message || "Registration failed");
          }
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password
        });
  
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Logged in successfully");
        } else {
          // Handling specific error for "Incorrect email or password"
          if (response.data.message === 'Invalid credentials') {
            toast.error("Incorrect email or password");
          } else {
            toast.error(response.data.message || "Login failed");
          }
        }
      }
    } catch (error) {
      console.error(" Axios Error:", error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  };
  
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className="login-page">
      <form onSubmit={OnSubmitHandler} className="login-form">
        <div className="login-header">
          <p className="login-title">{currentState}</p>
          <hr className="login-underline" />
        </div>

        {currentState === 'Sign Up' && (
          <input
            type="text"
            className="login-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="login-footer">
          <p className="login-link">Forgot your password?</p>
          {currentState === 'Login' ? (
            <p onClick={() => setCurrentState('Sign Up')} className="login-link">
              Create account
            </p>
          ) : (
            <p onClick={() => setCurrentState('Login')} className="login-link">
              Login Here
            </p>
          )}
        </div>
        <button type="submit" className="login-button">
          {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Login;
