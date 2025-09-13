import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig"; // axiosConfig should have your baseURL

const SERVER_URL = "http://localhost:5000"; // your backend server URL

const ConsumerAdoptCrop = () => {
  const [lands, setLands] = useState([]);
  const navigate = useNavigate();

  // Fetch available lands
  useEffect(() => {
    const fetchLands = async () => {
      try {
        const res = await axios.get("/lands"); // fetch all lands
        setLands(res.data);
      } catch (err) {
        console.error("Failed to fetch lands:", err);
      }
    };
    fetchLands();
  }, []);

  // Handle adopt
  const handleAdopt = async (landId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      // Call backend to adopt the land
      await axios.post(
        `/lands/adopt/${landId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Crop adopted successfully!");
      navigate("/profile"); // redirect to profile page
    } catch (err) {
      console.error("Adoption failed:", err);
      alert(err.response?.data?.message || "Failed to adopt crop. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h2 className="text-2xl font-bold text-[rgb(40,84,48)] mb-8">
        Adopt a Crop 🌾
      </h2>

      {lands.length === 0 && (
        <p className="text-gray-500 text-center">No lands available at the moment.</p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lands.map((land) => (
          <motion.div
            key={land._id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between border border-[rgb(164,190,123)]"
          >
            {/* Display first image */}
            <img
              src={
                land.images && land.images.length > 0
                  ? `${SERVER_URL}${land.images[0]}`
                  : ""
              }
              alt={land.location}
              className="h-40 w-full object-cover rounded-xl mb-4"
            />
            <h3 className="text-lg font-semibold">{land.landSize} acres</h3>
            <p className="text-sm text-gray-600">{land.location}</p>
            <p className="text-sm text-gray-600">Duration: {land.duration} months</p>
            <p className="text-md font-bold text-[rgb(95,141,78)]">
              Profit Share: {land.profitShare}%
            </p>

            {/* Adopt Now Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAdopt(land._id)}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-[rgb(95,141,78)] to-[rgb(40,84,48)] text-white shadow-md"
            >
              <Leaf size={18} /> Adopt Now
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ConsumerAdoptCrop;
