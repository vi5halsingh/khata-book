
import React, { useState, useRef } from "react";
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

function Authenticate() {
 
  const [showLogin, setShowLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    password: "",
    category: ""
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
        setLoad((p) => false);
        navigate('/see-record');
      }
    
    } catch (error) {
      setLoad((p) => false);
      toast.error(error.response?.data?.msg || 'Login failed');
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
              {['name', 'email', 'mobileNo', 'password' ,'category'].map((field) => (
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

              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white rounded-lg p-3 focus:ring-2 focus:ring-[#4caf50] outline-none"
                  required
                >
                  <option value="" className="bg-[#6e86ff]">Select Category</option>
                  <option value="general" className="bg-[#6e86ff] font-medium">General</option>
                  <option value="obc" className="bg-[#6e86ff] font-medium">OBC</option>
                  <option value="sc/st" className="bg-[#6e86ff] font-medium">SC/ST</option>
                </select>
              </div>

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