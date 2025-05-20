
// import './responsive.css';
import React, { useEffect, useState, useRef } from "react";

import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function Authenticate() {
    const [response, setResponse] = useState({});
    const [Data, setData] = useState({
      name: "",
      email: "",
      mobileNo: "",
      password: "",
      category: ""
    });
    const handleChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      setData((values) => ({ ...values, [name]: value }));
    };
  
    const handleSignup = async (e) => {
      e.preventDefault();
      
      try {
        console.log("Sending data:", Data);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(Data)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error:", errorData);
          alert(`Registration failed: ${errorData.msg || 'Unknown error'}`);
          return;
        }
        
        const data = await response.json();
        
        // Save token if provided in the response
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // alert("Registration successful!");
        setResponse(data);
        
        // Reset form with proper structure
        setData({
          name: "",
          email: "",
          mobileNo: "",
          password: "",
          category: ""
        });
      } catch (error) {
        console.error("Registration error:", error);
      }
    };
    
    const navigate = useNavigate();
    const handleLogin = async (e) => {
      e.preventDefault();
      
      try {
        // Create login data object with correct field names
        const loginData = {
          mobileNo: Data.mobileNo,
          password: Data.password
        };
        
        // console.log("Sending login data:", loginData);
        
     const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, loginData,{
      withCredentials:true,
     })
        const data = await response.data;
        // In login handler after successful response
        if (data.token) {
        // Store token in both cookie and localStorage for redundancy
        document.cookie = `authToken=${data.token}; path=/; max-age=86400; SameSite=None; Secure`;
        localStorage.setItem('authToken', data.token);
        }
        
        // alert("Login successful!");

    
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }


        navigate('/see-record');
      
        setData({
          ...Data,
          password: ""
        });
        
      } catch (error) {
        console.error("Login error:", error);
      }
    };

    const mobilelInput = useRef()

    const focusInput = () => {
      mobilelInput.current.focus();
        
    }

  return (
    <>
      <section className="container mx-auto w-4/5  flex gap-5 justify-center items-center h-[92vh]">
        <section className="login border-2 rounded-md border-white   w-2/5  h-[70%] ">
          <h1 className="text-xl font-bold m-auto w-full  text-center">Log In</h1>
          <form action="" className="1 mx-auto w-5/6">
            <div className="group p-3 raletive">
              <label htmlFor="mobile"
                onClick={focusInput}
                className="w-full font-medium text-lg mb-2">Mobile Number</label>
              <input type="phone" id="mobile"
                name="mobileNo"
                value={Data.mobileNo || ""}
                onChange={handleChange}
                ref={mobilelInput}
                className=" appearance-none border-b-3 border-[#4caf50] w-full py-2 px-3 focus:outline-2 focus:border-3 focus:rounded focus:shadow-outline outline-none text-sm font-medium" />
            </div>
            
            <div className="group p-3">
              <label htmlFor="password"
                className="w-full font-medium text-lg mb-2">Password</label>
              <input type="password"
                name="password"
                value={Data.password}
                onChange={handleChange}
                id="passwor  d" className="appearance-none border-b-3 border-[#4caf50] w-full py-2 px-3 focus:outline-2 focus:border-3 focus:rounded focus:shadow-outline outline-none text-sm font-medium " />
            </div>
            <div className="group p-3">
              <button type="submit"  onClick={handleLogin} className="border-3 border-[#4caf50] p-2 text-lg font-medium mx-auto text-center w-full hover:bg-[#4caf50] cursor-pointer rounded-full">Enter</button>
            </div>
          </form>
        </section>
        <section className="signup border-2 rounded-md border-white w-2/5  hover:rotate-0 hover:z-1 ">
          <h1 className="text-xl font-bold m-auto w-full  text-center">Sign Up</h1>
          <form action="" className=" mx-auto w-5/6">
          <div className="group raletive">
              <label htmlFor="name" className="w-full font-medium text-lg ">Full Name</label>
              <input type="name"
                name="name"
                value={Data.name}
                onChange={handleChange}
                id="name" className=" appearance-none border-b-3 border-[#4caf50] w-full py-1 px-3 focus:outline-2 focus:border-3 focus:rounded focus:shadow-outline outline-none text-sm font-medium  " />
            </div>
            <div className="group raletive">
              <label htmlFor="email" className="w-full font-medium text-lg ">Email Id</label>
              <input type="email"
                name="email"
                value={Data.email}
                onChange={handleChange}
                id="email" className=" appearance-none border-b-3 border-[#4caf50] w-full py-1 px-3 focus:outline-2 focus:border-3 focus:rounded focus:shadow-outline outline-none text-sm font-medium  " />
            </div>
            <div className="group raletive">
              <label htmlFor="mobileNo" className="w-full font-medium text-lg">Mobile Number</label>
              <input type="phone"
                name="mobileNo"
                value={Data.mobileNo || ""}
                onChange={handleChange}
                id="mobileNo"
                className=" appearance-none border-b-3 border-[#4caf50] w-full py-2 px-3 focus:outline-2 focus:border-3 focus:rounded focus:shadow-outline outline-none text-sm font-medium  " />
            </div>
            <div className="group raletive">
              <label htmlFor="passwd" className="w-full font-medium text-lg mb-2">Password</label>
              <input type="password"
                name="password"
                value={Data.password || ""}
                onChange={handleChange}
                id="passwd"
                className="appearance-none border-b-3 border-[#4caf50] w-full py-2 px-3 focus:outline-2 focus:border-3 focus:rounded focus:shadow-outline outline-none text-sm font-medium " />
            </div>
            <div className="group raletive">
              <label htmlFor="text" className="w-full font-medium text-lg mb-2">Category</label>
              <select
                name="category"
                value={Data.category}
                onChange={handleChange}>
                  className="appearance-none border-b-3 border-[#4caf50] w-full py-2 px-3 focus:outline-2 focus:border-3 focus:rounded focus:shadow-outline outline-none text-sm font-medium "
                <option >select</option>
                <option value="general">General</option>
                <option value="obc" >OBC</option>
                <option value="sc/st">SC/ST</option>
              </select>
            </div>
            <div className="group p-3">
              <button type="submit" className="border-3 border-[#4caf50] p-2 text-lg font-medium mx-auto text-center w-full hover:bg-[#4caf50] cursor-pointer rounded-full" onClick={handleSignup}>create account</button>
            </div>
          </form>
        </section>
      </section>
    </>
  )
}
export default Authenticate;