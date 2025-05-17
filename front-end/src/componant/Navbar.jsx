import React from "react"
import '../App.css'
import { IoNotificationsCircleSharp } from "react-icons/io5";
import { FcCurrencyExchange } from "react-icons/fc";
import { Link, Outlet } from 'react-router-dom'
import { motion } from 'motion/react'

function Navbar(){
    return (
        <>
      <motion.div  className="" drag dragConstraints={{ left: 0, right: 0, top: 0, bottom:0 }}>

<section className="nav border-2 border-white p-3 rounded-full flex justify-between items-center w-3/5 m-auto mt-5">
    <div className="left">
        <div className="logo text-5xl font-bold"> <Link to='/'> <FcCurrencyExchange /> </Link> </div>
    </div>
    <div className="right justify-center items-center  flex w-1/2">
        <ul className="flex justify-centre gap-8 w-full">
            <li className="text-xl font-medium">
                <Link to="/see-record"> see recods </Link>
            </li>
            <li className="text-xl font-medium">
                <Link to="/say-something"> say sything </Link>
            </li>
        </ul>
        <Link to="/notification"> <div className="notifiction text-5xl font-bold text-[#4caf50]">< IoNotificationsCircleSharp /></div> </Link>
    </div>
</section>
</motion.div>
        </>
    )
}
export default Navbar;