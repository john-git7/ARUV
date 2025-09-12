import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sprout, ShoppingBasket } from "lucide-react";

const RoleSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/signup?role=${role}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[rgb(79, 183, 179)] text-[#285430]">
      <motion.div
        className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl shadow-2xl text-center max-w-lg w-full border border-[#A4BE7B]/40"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-8">Choose Your Role</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <motion.button
            onClick={() => handleSelect("farmer")}
            className="flex flex-col items-center gap-3 bg-gradient-to-r from-[#5F8D4E] to-[#285430] text-white px-6 py-6 rounded-xl font-semibold text-lg shadow-md hover:shadow-xl transition-transform hover:-translate-y-1"
            whileTap={{ scale: 0.95 }}
          >
            <Sprout size={36} />
            Farmer
          </motion.button>
          <motion.button
            onClick={() => handleSelect("consumer")}
            className="flex flex-col items-center gap-3 bg-white text-[#285430] border-2 border-[#5F8D4E] px-6 py-6 rounded-xl font-semibold text-lg shadow-md hover:bg-[#A4BE7B]/30 transition-transform hover:-translate-y-1"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBasket size={36} />
            Consumer
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelect;
