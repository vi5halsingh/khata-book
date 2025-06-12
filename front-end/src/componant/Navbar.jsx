import React, { useState } from "react";
import '../App.css';
import { IoNotificationsCircleSharp } from "react-icons/io5";
import { FcCurrencyExchange } from "react-icons/fc";
import { HiMenuAlt3, HiX } from "react-icons/hi"; // menu icons
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'motion/react';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <motion.div className="px-3 md:px-0" drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <section className="nav border-2 border-white p-3 rounded-full flex justify-between items-center md:w-3/5 m-auto mt-5 relative">
                    <div className="left">
                        <div className="logo text-5xl font-bold">
                            <Link to='/'> <FcCurrencyExchange /> </Link>
                        </div>
                    </div>

                    {/* Mobile menu icon */}
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-4xl">
                            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
                        </button>
                    </div>

                    {/* Links - hide on small screens */}
                    <div className="right md:flex hidden justify-center items-center w-1/2">
                        <ul className="flex justify-center gap-8 w-full">
                            <li className="text-xl font-medium">
                                <Link to="/see-record"> see recods </Link>
                            </li>
                            <li className="text-xl font-medium">
                                <Link to="/say-something"> say something </Link>
                            </li>
                        </ul>
                        <Link to="/notification">
                            <div className="notifiction text-5xl font-bold text-[#4caf50]">
                                <IoNotificationsCircleSharp />
                            </div>
                        </Link>
                    </div>

                    {/* Mobile menu dropdown */}
                    {menuOpen && (
                        <div className="absolute top-full left-0 w-full bg-transparant border border-b-blue-600 backdrop-blur-md text-white rounded-xl shadow-md z-50 p-4 md:hidden">
                            <ul className="flex flex-col gap-4">
                                <li className="text-lg font-medium">
                                    <Link to="/see-record" onClick={() => setMenuOpen(false)}> see recods </Link>
                                </li>
                                <li className="text-lg font-medium">
                                    <Link to="/say-something" onClick={() => setMenuOpen(false)}> say something </Link>
                                </li>
                                <li>
                                    <Link to="/notification" onClick={() => setMenuOpen(false)}>
                                        <div className="text-4xl text-[#4caf50]"><IoNotificationsCircleSharp /></div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </section>
            </motion.div>
        </>
    );
}

export default Navbar;
