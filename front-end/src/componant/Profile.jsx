import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from "react-icons/io5";
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", mobileNo: "", category: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        setUserData(response.data);
        setEditData(response.data);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.msg || 'Failed to load profile');
        if (error.response?.status === 401) navigate('/');
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile/update`, editData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      setUserData(editData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Update failed');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        withCredentials: true
      });
      localStorage.removeItem('authToken');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Logout failed');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-medium text-[#4caf50]"
      >
        Loading profile...
      </motion.div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-2 md:p-6"
    >
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1a1b29', color: '#fff', border: '1px solid #4caf50' }
      }} />

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20"
        >
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/see-record')}
              className="text-[#4caf50] flex items-center gap-1 hover:underline"
            >
              <IoArrowBackOutline className="text-xl" /> 
              <span className="hidden md:inline">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4caf50]">My Profile</h1>
            <div></div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {['name', 'email', 'mobileNo'].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="text-sm md:text-base text-gray-300 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={editData[field] || ""}
                    onChange={handleEditChange}
                    className="w-full bg-white/10 text-white rounded-lg p-2 md:p-3 focus:ring-2 focus:ring-[#4caf50] outline-none"
                  />
                </div>
              ))}

              <div className="space-y-1">
                <label className="text-sm md:text-base text-gray-300">Category</label>
                <select
                  name="category"
                  value={editData.category || ""}
                  onChange={handleEditChange}
                  className="w-full bg-white/10 text-white rounded-lg p-2 md:p-3 focus:ring-2 focus:ring-[#4caf50] outline-none"
                >
                  <option value="general" className="bg-[#6e86ff]" >General</option>
                  <option value="obc" className="bg-[#6e86ff]" >OBC</option>
                  <option value="sc/st" className="bg-[#6e86ff]" >SC/ST</option>
                </select>
              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-6">
                <button
                  type="submit"
                  className="w-full md:w-1/2 bg-[#4caf50] text-white py-2 md:py-3 rounded-lg hover:bg-[#3d8b40] transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full md:w-1/2 bg-gray-500 text-white py-2 md:py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4  overflow-x-hidden md:overflow-x-auto">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#4caf50] flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {['name', 'email', 'mobileNo', 'category'].map((field) => (
                <div key={field} className="space-y-1">
                  <span className="text-sm md:text-base text-gray-400 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <p className="text-base md:text-lg font-medium">
                    {userData[field] || "Not specified"}
                  </p>
                </div>
              ))}

              <div className="flex flex-col md:flex-row gap-3 mt-8">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full md:w-1/2 bg-[#4caf50] text-white py-2 md:py-3 rounded-lg hover:bg-[#3d8b40] transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full md:w-1/2 bg-red-500 text-white py-2 md:py-3 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Profile;