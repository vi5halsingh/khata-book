import React, { useState, useRef } from "react";
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import {GoogleLogin} from '@react-oauth/google'
import {jwtDecode} from "jwt-decode";


function Authenticate() {
  const [showLogin, setShowLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    password: "",
  });
  const navigate = useNavigate();
  const mobileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
const [load , setLoad] =  useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!Object.values(formData).every(field => field.trim())) {
        toast.error("Please fill all fields");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/register`,
        formData
      );

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setFormData({ name: "", email: "", mobileNo: "", password: "", category: "" });
        toast.success("Registration successful");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Registration failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
        { mobileNo: formData.mobileNo, password: formData.password },
        { withCredentials: true }
      );
      
      
     
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        document.cookie = `authToken=${data.token}; path=/; max-age=86400; SameSite=None; Secure`;
        navigate('/see-record');
        setLoad((p) => false);
      }
    
    } catch (error) {
      setLoad((p) => false);
      toast.error(error.response?.data?.msg || 'Login failed');
    }
  };
  // onSuccess from GoogleLogin
const handleGoogleLogin = async (credentialResponse) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/users/google-login`,
      {
        token: credentialResponse.credential,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (res.data.success && res.data.token) {
      // Store token in localStorage
      localStorage.setItem('authToken', res.data.token);
      
      // Set cookie
      document.cookie = `authToken=${res.data.token}; path=/; max-age=86400; SameSite=None; Secure`;
      
      // Set default Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      toast.success("Successfully logged in with Google");
      navigate('/see-record');
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Google login error:', error);
    toast.error(error.response?.data?.msg || 'Google login failed. Please try again.');
  }
};


  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-8 bg-gradient-to-br from-oklch(0.558 0.288 302.321) to-oklch(0.623 0.214 259.815 ) ">
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1a1b29', color: '#fff', border: '1px solid #4caf50' }
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full md:max-w-1/2"
      >
        {showLogin ? (
          <motion.div
            key="login"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h1 className="text-2xl font-bold text-center mb-6 text-[#4caf50]">Log In</h1>
            <form className="space-y-4 relative" onSubmit={handleLogin}>
              <div>
                <label className="block text-gray-300 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNo"
                  ref={mobileInputRef}
                  value={formData.mobileNo}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white rounded-lg p-3 focus:ring-2 focus:ring-[#4caf50] outline-none"
                  required
                  onKeyDown={(e)=>{
                    if(!/[0-9]/.test(e.key) && e.key !=="Backspace" && e.key !== "Tab"){
                      e.preventDefault()
                      // toast.error("enter valid mobile number")
                    }
                  }}
                  min={0}
                  maxLength={10}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white rounded-lg p-3 focus:ring-2 focus:ring-[#4caf50] outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4caf50] text-white py-3 rounded-lg hover:bg-[#3d8b40] transition-colors"
              >
                Sign In
              </button>
              <GoogleLogin
              
      onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse)}
      onError={() => {
        console.log('Login Failed');
        toast.error("Google login failed try manually")
      }}
    />
            </form>

            <p className="text-center mt-4 text-gray-300">
              Don't have an account? {' '}
              <button
                onClick={() => setShowLogin(false)}
                className="text-[#4caf50] hover:underline"
              >
                Sign Up
              </button>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-5  overflow-y-auto h-[80vh] w-full border  border-white/20 "
          >
            <h1 className="text-2xl font-bold text-center mb-6 text-[#4caf50]">Sign Up</h1>
            <form className="space-y-4 relative" onSubmit={handleSignup}>
              {['name', 'email', 'mobileNo', 'password'].map((field) => (
                <div key={field}>
                  <label className="block text-gray-300 mb-2 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full bg-white/10 text-white rounded-lg p-3 focus:ring-2 focus:ring-[#4caf50] outline-none"
                    required
                    
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-[#4caf50] text-white py-3 rounded-lg hover:bg-[#3d8b40] transition-colors"
              >
                Create Account
              </button>
            </form>

            <p className="text-center mt-4 text-gray-300">
              Already have an account? {' '}
              <button
                onClick={() => setShowLogin(true)}
                className="text-[#4caf50] hover:underline"
              >
                Login
              </button>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Authenticate;