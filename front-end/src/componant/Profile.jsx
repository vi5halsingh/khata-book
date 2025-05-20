import React, { useState, useEffect } from 'react';
// import './authenticate.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from "react-icons/io5";
import { Toaster, toast } from 'react-hot-toast';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    category: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
          withCredentials: true,
          headers:{
            'authorization':`Bearer ${localStorage.getItem('authToken')}`
          }
        });
       
        setUserData(response.data);
        setEditData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please login again.");
        setLoading(false);
        
        // If unauthorized, redirect to login
        if (error.response && error.response.status === 401) {
          navigate('/');
        }
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
      // This endpoint would need to be implemented on the backend
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile/update`, editData, {
        withCredentials: true,
      });
      
      setUserData(editData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    }catch (error) {
      console.error("Error fetching profile:", error);
      const message = error.response?.data?.msg || "Failed to load profile. Please login again.";
      toast.error(message);
      if (error.response?.status === 401) navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint to clear the HTTP-only cookie
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/logout`, {}, {
        withCredentials: true
      });
      
      // Also clear any client-side storage
      localStorage.removeItem('authToken');
      
      // Redirect to home/login page
      navigate('/');
    }
    catch (error) {
      console.error("Error updating profile:", error);
      const message = error.response?.data?.msg || "Failed to Logout . Please try again.";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-medium text-[#4caf50]">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-medium text-red-500">{error}</div>
      </div>
    );
  }

  return (
    
    <section className="mt-3 container mx-auto my-auto h-full w-4/5 flex justify-center items-center">
        <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#1a1b29',
          color: '#fff',
          border: '1px solid #4caf50'
        }
      }}
    />
      <div className="profile-container border-2 rounded-md border-white w-2/5 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/see-record')} 
            className="text-[#4caf50] flex items-center gap-1 hover:underline"
          >
            <IoArrowBackOutline /> Back
          </button>
          <h1 className="text-2xl font-bold text-center text-[#4caf50]">My Profile</h1>
          <div></div> {/* Empty div for flex alignment */}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="mx-auto w-5/6">
            <div className="group mb-4">
              <label htmlFor="name" className="w-full font-medium text-lg">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={editData.name || ""} 
                onChange={handleEditChange}
                className="appearance-none border-b-3 border-[#4caf50] w-full py-2 px-3 focus:outline-2 focus:border-3 focus:rounded focus:shadow-outline outline-none text-sm font-medium"
              />
            </div>
            
            <div className="group mb-4">
              <label htmlFor="email" className="w-full font-medium text-lg">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={editData.email || ""} 
                onChange={handleEditChange}
                className="appearance-none border-b-3 border-[#4caf50] w-full py-2 px-3 focus:outline-2 focus:border-3 focus:rounded focus:shadow-outline outline-none text-sm font-medium"
              />
            </div>
            
            <div className="group mb-4">
              <label htmlFor="mobileNo" className="w-full font-medium text-lg">Mobile Number</label>
              <input 
                type="text" 
                id="mobileNo" 
                name="mobileNo" 
                value={editData.mobileNo || ""} 
                onChange={handleEditChange}
                className="appearance-none border-b-3 border-[#4caf50] w-full py-2 px-3 focus:outline-2 focus:border-3 focus:rounded focus:shadow-outline outline-none text-sm font-medium"
              />
            </div>
            
            <div className="group mb-4">
              <label htmlFor="category" className="w-full font-medium text-lg">Category</label>
              <select
                id="category"
                name="category"
                value={editData.category || ""}
                onChange={handleEditChange}
                className="appearance-none border-b-3 border-[#4caf50] w-full py-2 px-3 focus:outline-2 focus:border-3 focus:rounded focus:shadow-outline outline-none text-sm font-medium bg-transparent"
              >
                <option value="not selected " className='text-black'>Select</option>
                <option value="general" className='text-black'>General</option>
                <option value="obc" className='text-black'>OBC</option>
                <option value="sc/st" className='text-black'>SC/ST</option>
              </select>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button 
                type="submit" 
                className="border-3 border-[#4caf50] p-2 text-lg font-medium mx-auto text-center w-full hover:bg-[#4caf50] cursor-pointer rounded-full"
              >
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setEditData(userData);
                }}
                className="border-3 border-gray-400 p-2 text-lg font-medium mx-auto text-center w-full hover:bg-gray-200 cursor-pointer rounded-full"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mx-auto w-5/6">
            <div className="mb-6 text-center">
              <div className="w-24 h-24 rounded-full bg-[#4caf50] mx-auto flex items-center justify-center text-white text-3xl font-bold">
                {userData.name ? userData.name.charAt(0).toUpperCase() : "0"}
              </div>
            </div>
            
            <div className="group mb-4">
              <label className="w-full font-medium text-lg text-gray-600">Full Name</label>
              <p className="text-xl font-medium">{userData.name}</p>
            </div>
            
            <div className="group mb-4">
              <label className="w-full font-medium text-lg text-gray-600">Email</label>
              <p className="text-xl font-medium">{userData.email}</p>
            </div>
            
            <div className="group mb-4">
              <label className="w-full font-medium text-lg text-gray-600">Mobile Number</label>
              <p className="text-xl font-medium">{userData.mobileNo}</p>
            </div>
            
            <div className="group mb-4">
              <label className="w-full font-medium text-lg text-gray-600">Category</label>
              <p className="text-xl font-medium capitalize">{userData.category || "Not specified"}</p>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setIsEditing(true)} 
                className="border-3 border-[#4caf50] p-2 text-lg font-medium mx-auto text-center w-full hover:bg-[#4caf50] cursor-pointer rounded-full"
              >
                Edit Profile
              </button>
              <button 
                onClick={handleLogout} 
                className="border-3 border-red-500 p-2 text-lg font-medium mx-auto text-center w-full hover:bg-red-500 hover:text-white cursor-pointer rounded-full"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Profile;