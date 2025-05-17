import React,{useState , useRef, useEffect} from "react";
import { IoAddCircleOutline, IoCloseCircleOutline, IoPersonCircleOutline } from "react-icons/io5";
import { FcCurrencyExchange } from "react-icons/fc";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
function RecordHeader(props) {
  // console.log(props)
    const AddNew = () => props.setAdding((p) => !p)

  return (  
    <motion.div className="flex justify-center mt-5" drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}>
      <section className="nav border-2 border-white p-3 rounded-full flex justify-between items-center max-w-[90%] md:max-w-3/5 w-full">
        <div className="left flex items-center gap-5">
          <div className="logo text-5xl font-bold">
            <Link to="/">
              <FcCurrencyExchange />
            </Link>
          </div>
          {/* <div>
            <input type="text" className="border rounded px-2 py-1 focus:outline-none" placeholder="Search..." />
          </div> */}
        </div>
        <div className="right flex items-center gap-8">
          {!props.adding && (
            <button className="text-5xl text-[#4caf50] font-medium cursor-pointer">
              <IoAddCircleOutline onClick={AddNew} />
            </button>
          )}

          <div className="profile text-5xl font-bold text-[#4caf50]">
            <Link to="/profile">
              <IoPersonCircleOutline />
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default RecordHeader;
