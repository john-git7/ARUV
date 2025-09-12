import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../axiosConfig";

const Profile = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null });
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    localStorage.setItem("role", user.role);

    const particleCount = 100;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 1,
      dy: (Math.random() - 0.5) * 1,
    }));

    const handleMouseMove = (e) => {
      mouse.current.x = e.x;
      mouse.current.y = e.y;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#5F8D4E";
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        if (mouse.current.x && mouse.current.y) {
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(95,141,78,${1 - distance / 100})`;
            ctx.lineWidth = 2;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await axios.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError("Failed to load profile. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <motion.div
        className="relative z-10 w-full max-w-3xl p-10 rounded-3xl shadow-2xl bg-white/70 backdrop-blur-lg border border-white/30 space-y-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Back to Dashboard Button */}
                    <div className="flex justify-start">
              <button
                onClick={() => navigate(`/dashboard/${user.role}`)} // ✅ use backticks for template literal
                className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>


        <motion.h2
          className="text-4xl md:text-5xl font-bold text-green-900 text-center"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        >
          Welcome, <span className="text-green-600">{user.firstName} {user.lastName}</span>
        </motion.h2>

        <p className="text-center text-green-800/70 mb-6 text-lg md:text-xl">
          {user.role === "farmer" ? "Farmer Dashboard" : "Consumer Dashboard"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-white/50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-semibold text-green-700 mb-2">Personal Info</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>City:</strong> {user.city}</p>
          </div>

          <div className="p-5 bg-white/50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-semibold text-green-700 mb-2">Role Details</h3>
            <p><strong>Role:</strong> {user.role}</p>
            {user.role === "farmer" && (
              <>
                <p><strong>Farm Name:</strong> {user.farmName}</p>
                <p><strong>Farm Address:</strong> {user.farmAddress}</p>
              </>
            )}
            {user.role === "consumer" && (
              <p><strong>Delivery Address:</strong> {user.deliveryAddress}</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
