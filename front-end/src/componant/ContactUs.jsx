import React, { useState } from "react";
import { motion } from "framer-motion";
import { data } from "react-router-dom";
import axios from "axios";

const ContactUs = () => {
  const [Data , setData] = useState({
    name:"",
    email:"",
    mobile:"",
    message:""
  })
  const [name, setName] = useState()

  function handleChange(e) { 
   const  name = e.target.name 
   const value =  e.target.value
  setData({...Data,[name]: value})
  }



async function handleSubmit(e) {
  e.preventDefault()
  const newData = {
    name:Data.name,
    email:Data.email,
    mobile:Data.mobile,
    message:Data.message
  }
  console.log("new data is : ",Data)
  
  const response = axios.post("http://localhost:5000/api/users/contact",newData, {
    withCredentials:true,
    headers: {
       Authorization: localStorage.getItem("authToken"),
    },
  }).then((res)=>{  
    console.log(res)
  }).catch((err)=>{
    console.log(err)
  })

  if(response.status === 200){
    alert("Message has been sent successfully") 
  }else{
    alert("Message has not been sent ! please try again")
  }
  const data = await response.data
  console.log("data is : ",data)


  setData({
    name:"",
    email:"",
    mobile:"",
    message:""
  })
}
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
       
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20 w-full max-w-lg"
      >
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Contact Us
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <motion.input  
            name="name"
            value={Data.name}
            whileFocus={{ scale: 1.05 }}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-blue-300"
            type="text"
            placeholder="Enter your name"
            onChange={handleChange }
          />
         <motion.input
            whileFocus={{ scale: 1.05 }}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-blue-300"
            type="email"
            placeholder="Enter your email"
            name="email"
            value={Data.email}  
            onChange={ handleChange}
          />
            
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-blue-300"
            type="tel"
            placeholder="Enter your mobile number"
            name="mobile"
         value={Data.mobile}
            onChange={handleChange }
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-blue-300"
            type="textarea"
            placeholder="Enter your message"
            name="message"
          value={Data.message}
            onChange={ handleChange}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition cursor-pointer"
            type="submit"
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactUs;
