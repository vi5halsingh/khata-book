import React from "react"
import '../App.css'
import { IoNotificationsCircleSharp } from "react-icons/io5";
import { FcCurrencyExchange } from "react-icons/fc";
import Authenticate from "../componant/Authenticate";
import Navbar from "../componant/Navbar";
import { Outlet } from 'react-router-dom'
import Footer from '../componant/Footer'

function Home() {
    return (
        <>
        <Authenticate />
        <Footer />

        </>
    )
}

export default Home;