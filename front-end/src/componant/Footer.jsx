import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/5 backdrop-blur-lg border-t border-white/20 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-[#4caf50] text-lg font-semibold">Khata Book</h3>
            <p className="text-gray-300 text-sm">
              Your trusted digital ledger for managing transactions and maintaining financial records efficiently.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#4caf50] transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4caf50] transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4caf50] transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4caf50] transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#4caf50] text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/see-record" className="text-gray-300 hover:text-[#4caf50] transition-colors">
                  View Records
                </Link>
              </li>
              <li>
                <Link to="/add-record" className="text-gray-300 hover:text-[#4caf50] transition-colors">
                  Add Record
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-[#4caf50] transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[#4caf50] text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#4caf50] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#4caf50] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#4caf50] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#4caf50] text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">
                Email: support@khatabook.com
              </li>
              <li className="text-gray-300">
                Phone: +91 1234567890
              </li>
              <li className="text-gray-300">
                Address: 123 Business Street, City, State, India
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Khata Book. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer; 