import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Leaf } from "lucide-react";
import axios from "../axiosConfig";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [lands, setLands] = useState([]);
  const [activeTab, setActiveTab] = useState("info"); // 'info' or 'items'
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        localStorage.setItem("role", res.data.role);
      } catch (err) {
        setError("Failed to load profile.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  // Fetch lands for farmers
  useEffect(() => {
    const fetchLands = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("/lands/mylands", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLands(res.data);
      } catch (err) {
        console.error("Failed to fetch lands", err);
      }
    };
    if (user?.role === "farmer") fetchLands();
  }, [user]);

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-8 text-white relative">
          <button
            onClick={() => navigate(`/dashboard/${user.role}`)}
            className="absolute top-5 left-5 bg-white text-green-700 font-semibold px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-6 mt-10">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-green-700 font-bold text-2xl shadow-lg">
              {user.firstName?.[0]}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="text-teal-100">{user.role.toUpperCase()} Dashboard</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300">
          <button
            className={`flex-1 py-3 font-semibold ${
              activeTab === "info" ? "border-b-4 border-green-700 text-green-700" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Personal Info
          </button>
          <button
            className={`flex-1 py-3 font-semibold ${
              activeTab === "items" ? "border-b-4 border-green-700 text-green-700" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("items")}
          >
            {user.role === "farmer" ? "Your Lands" : "Booked Products"}
          </button>
        </div>

        <div className="p-8">
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Info */}
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow-md p-6 space-y-3">
                <h3 className="text-lg font-semibold text-green-700 mb-4">Personal Info</h3>
                <p className="flex items-center gap-2 text-gray-700"><Mail className="w-5 h-5 text-green-600" /> {user.email}</p>
                <p className="flex items-center gap-2 text-gray-700"><Phone className="w-5 h-5 text-green-600" /> {user.phone}</p>
                <p className="flex items-center gap-2 text-gray-700"><MapPin className="w-5 h-5 text-green-600" /> {user.city}</p>
              </motion.div>

              {/* Role Info */}
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-green-700 mb-4">Role Details</h3>
                <p><strong>Role:</strong> {user.role}</p>
                {user.role === "farmer" && <>
                  <p><strong>Farm Name:</strong> {user.farmName}</p>
                  <p><strong>Farm Address:</strong> {user.farmAddress}</p>
                </>}
                {user.role === "consumer" && <p><strong>Delivery Address:</strong> {user.deliveryAddress}</p>}
              </motion.div>
            </div>
          )}

          {activeTab === "items" && (
            <div>
              {user.role === "farmer" ? (
                lands.length === 0 ? (
                  <p className="text-gray-500">No lands listed yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lands.map((land) => (
                      <motion.div key={land._id} whileHover={{ y: -5, scale: 1.01 }} className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
                        <p className="font-semibold text-green-700 mb-2">
                          <Leaf className="inline w-4 h-4 mr-1 text-green-600" /> {land.location}
                        </p>
                        <p className="text-gray-700"><strong>Size:</strong> {land.landSize} acres</p>
                        <p className="text-gray-700"><strong>Duration:</strong> {land.duration} months</p>
                        <p className="text-gray-700"><strong>Profit Share:</strong> {land.profitShare}%</p>
                        <div className="flex gap-2 mt-3">
                          {land.images.map((img, i) => (
                            <img key={i} src={img} alt="land" className="h-20 w-24 object-cover rounded-lg shadow-sm" />
                          ))}
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");
                              await axios.delete(`/lands/${land._id}`, { headers: { Authorization: `Bearer ${token}` } });
                              setLands((prev) => prev.filter((l) => l._id !== land._id));
                            } catch (err) {
                              console.error("Failed to delete land", err);
                            }
                          }}
                          className="mt-3 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          Delete Land
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )
              ) : (
                <div>
                  {user.bookedProducts?.length === 0 ? (
                    <p className="text-gray-500">No products booked yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {user.bookedProducts.map((prod, i) => (
                        <motion.div key={i} whileHover={{ y: -5, scale: 1.01 }} className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
                          <img src={`http://localhost:5000${prod.image}`} alt={prod.cropName} className="h-32 w-full object-cover rounded-lg mb-3" />
                          <p className="font-semibold text-green-700">{prod.cropName}</p>
                          <p className="text-gray-700"><strong>Price:</strong> ₹{prod.price} / kg</p>
                          <p className="text-gray-700"><strong>Quantity:</strong> {prod.quantity} kg</p>
                          <button
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem("token");
                                await axios.delete(`/auth/cancel/${prod._id}`, { headers: { Authorization: `Bearer ${token}` } });
                                setUser((prev) => ({ ...prev, bookedProducts: prev.bookedProducts.filter((p) => p._id !== prod._id) }));
                              } catch (err) {
                                console.error("Cancel failed", err);
                              }
                            }}
                            className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Cancel Adoption
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
