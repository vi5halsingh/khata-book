import React from "react"
import '../App.css'
import Authenticate from "../components/Authenticate";
import Footer from '../components/Footer'

function Home() {
    return (
        <>
        <Authenticate />
        <Footer />
        </>
    )
}

export default Home;