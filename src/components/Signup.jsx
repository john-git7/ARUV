import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Leaf,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Home,
  MapPin,
  Package, Eye, EyeOff
} from "lucide-react";

const Signup = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null });
  const animationFrameRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState("role"); // "role" or "form"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    farmName: "",
    farmAddress: "",
    farmProducts: "",
    deliveryAddress: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setStep("form");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    setErrors({});
    console.log("Form Data Submitted:", formData);
  };

  // 🎨 Particle Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const particleCount = 100;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 1,
      dy: (Math.random() - 0.5) * 1,
    }));

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(95, 141, 78)";
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        if (mouse.current.x && mouse.current.y) {
          const distX = p.x - mouse.current.x;
          const distY = p.y - mouse.current.y;
          const distance = Math.sqrt(distX * distX + distY * distY);
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(40,84,48,${1 - distance / 100})`;
            ctx.lineWidth = 2;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.stroke();
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-[rgb(40,84,48)]">
      {/* Particle Background */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      <motion.div
        className="relative z-10 max-w-2xl w-full px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {/* STEP 1: Role Selection */}
          {step === "role" && (
            <motion.div
              key="role-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[rgb(164,190,123)] text-center space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Choose Your Role
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => handleRoleSelect("farmer")}
                  className="flex flex-col items-center gap-3 bg-gradient-to-r from-[rgb(95,141,78)] to-[rgb(40,84,48)] text-white px-6 py-6 rounded-xl font-semibold text-lg shadow-md hover:shadow-xl transition-transform hover:-translate-y-1"
                  whileTap={{ scale: 0.97 }}
                >
                  <Leaf size={32} />
                  Farmer
                </motion.button>

                <motion.button
                  onClick={() => handleRoleSelect("consumer")}
                  className="flex flex-col items-center gap-3 bg-white text-[rgb(40,84,48)] border-2 border-[rgb(95,141,78)] px-6 py-6 rounded-xl font-semibold text-lg shadow-md hover:bg-[rgb(164,190,123)]/30 transition-transform hover:-translate-y-1"
                  whileTap={{ scale: 0.97 }}
                >
                  <ShoppingCart size={32} />
                  Consumer
                </motion.button>
              </div>

              <div className="w-full max-w-sm mx-auto mt-4">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 text-[rgb(40,84,48)] hover:text-[rgb(95,141,78)] transition-colors group"
                >
                  <ArrowLeft
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Back to Home
                </Link>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Signup Form */}
          {step === "form" && (
            <motion.div
              key="form-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-[rgb(164,190,123)]"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
                {formData.role === "farmer"
                  ? "FARMER SIGNUP"
                  : "CONSUMER SIGNUP"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm mb-1">
                      <User size={16} /> First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-[rgb(95,141,78)] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm mb-1">
                      <User size={16} /> Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-[rgb(95,141,78)] outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm mb-1">
                      <Mail size={16} /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-[rgb(95,141,78)] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm mb-1">
                      <Phone size={16} /> Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-[rgb(95,141,78)] outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Farmer Section */}
                {formData.role === "farmer" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="flex items-center gap-2 text-sm mb-1">
                        <Home size={16} /> Farm / Business Name
                      </label>
                      <input
                        type="text"
                        name="farmName"
                        value={formData.farmName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-[rgb(95,141,78)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm mb-1">
                        <MapPin size={16} /> Farm Address
                      </label>
                      <input
                        type="text"
                        name="farmAddress"
                        value={formData.farmAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-[rgb(95,141,78)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm mb-1">
                        <Package size={16} /> Products
                      </label>
                      <input
                        type="text"
                        name="farmProducts"
                        value={formData.farmProducts}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-[rgb(95,141,78)] outline-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Consumer Section */}
                {formData.role === "consumer" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="flex items-center gap-2 text-sm mb-1">
                      <MapPin size={16} /> Delivery Address
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-[rgb(95,141,78)] outline-none"
                      rows="3"
                    />
                  </motion.div>
                )}

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Password */}
                      <div className="relative">
                        <label className="flex items-center gap-2 text-sm mb-1">
                          <Lock size={16} /> Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-[rgb(95,141,78)] outline-none pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-9 text-[rgb(95,141,78)] hover:text-[rgb(40,84,48)]"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <label className="flex items-center gap-2 text-sm mb-1">
                        <Lock size={16} /> Confirm Password
                      </label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-[rgb(95,141,78)] outline-none pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-9 text-[rgb(95,141,78)] hover:text-[rgb(40,84,48)]"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[rgb(95,141,78)] to-[rgb(40,84,48)] text-white rounded-2xl font-semibold shadow-lg hover:opacity-90 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-0.5"
                >
                  Sign Up
                </motion.button>

                {/* Footer */}
                <div className="w-full mt-4">
                  <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-3 text-sm text-center">
                    <p className="text-[rgb(40,84,48)]">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-[rgb(95,141,78)] font-semibold hover:underline"
                      >
                        Login here
                      </Link>
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep("role")}
                      className="inline-flex items-center gap-2 text-[rgb(40,84,48)] hover:text-[rgb(95,141,78)] transition-colors group"
                    >
                      <ArrowLeft
                        size={16}
                        className="group-hover:-translate-x-1 transition-transform"
                      />
                      Back to Role
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Signup;
