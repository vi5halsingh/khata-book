import React from "react"
import '../App.css'
import { IoNotificationsCircleSharp } from "react-icons/io5";
import { FcCurrencyExchange } from "react-icons/fc";
import Authenticate from "../componant/Authenticate";
import Navbar from "../componant/Navbar";
import { Outlet } from 'react-router-dom'

function Home() {
    return (
        <>
        <Authenticate />
        </>
    )
}

export default Home;