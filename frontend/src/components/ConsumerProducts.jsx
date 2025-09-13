import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import axios from "../axiosConfig";

const ConsumerProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleBook = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    await axios.post(`/bookings/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Product booked successfully! 🎉");
  } catch (err) {
    console.error("Booking failed", err);
    alert("Failed to book product");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h2 className="text-2xl font-bold text-[rgb(40,84,48)] mb-8">
        Fresh From Farmers 🌱
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <motion.div
            key={p._id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between border border-[rgb(164,190,123)]"
          >
            <img
              src={
                p.images?.length
                  ? `http://localhost:5000${p.images[0]}`
                  : "/placeholder.jpg"
              }
              alt={p.cropName}
              className="h-40 w-full object-cover rounded-xl mb-4"
            />

            <h3 className="text-lg font-semibold">{p.cropName}</h3>
            <p className="text-sm text-gray-600">{p.quantity} kg available</p>
            <p className="text-md font-bold text-[rgb(95,141,78)]">
              ₹{p.price} / kg
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBook(p._id)}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-[rgb(95,141,78)] to-[rgb(40,84,48)] text-white shadow-md"
            >
              <ShoppingCart size={18} /> Book Now
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ConsumerProducts;
