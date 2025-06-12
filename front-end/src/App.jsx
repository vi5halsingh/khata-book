import React from "react";
import './App.css'
import './style.css'
import Home from './pages/Home'
import { SeeRecord } from './pages/SeeRecord'
import { SaySomething } from "./pages/SaySomething";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from "./pages/Layout";
import Notification from './pages/Notification'
import Profile from './componant/Profile'


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="say-something" element={<SaySomething />} />
            <Route path="notification" element={<Notification />} />
          </Route>
          <Route path="/see-record" element={<SeeRecord />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
