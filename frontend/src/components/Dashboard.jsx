  import React, { useEffect, useRef } from "react";
  import { motion } from "framer-motion";
  import { Leaf, ShoppingCart, Upload, Bell, LogOut, User } from "lucide-react";
  import { useNavigate } from "react-router-dom";

  const Dashboard = () => {
    const canvasRef = useRef(null);
    const mouse = useRef({ x: null, y: null });
    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username") || "User";

    // Redirect if not logged in
    useEffect(() => {
      if (!token) navigate("/login");
    }, [token, navigate]);

    // Role-based actions
    const farmerActions = [
      { label: "Upload Projects", icon: <Upload size={32} />, description: "Add new products or crops to your farm portfolio." },
      { label: "Offer Your Farmland", icon: <Leaf size={32} />, description: "Lease your land to consumers for seasonal crops." },
    ];

    const consumerActions = [
      { label: "View Products", icon: <ShoppingCart size={32} />, description: "Browse fresh products directly from farmers." },
      { label: "Adopt a Crop", icon: <Leaf size={32} />, description: "Lease land from farmers to grow your own crops." },
    ];

    const actions = role === "farmer" ? farmerActions : consumerActions;

    // Particle background with mouse interaction
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
          ctx.fillStyle = "rgb(95,141,78)";
          ctx.fill();

          p.x += p.dx;
          p.y += p.dy;
          if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

          if (mouse.current.x && mouse.current.y) {
            const dx = p.x - mouse.current.x;
            const dy = p.y - mouse.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(95,141,78,${1 - dist / 100})`;
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
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", resizeCanvas);
      };
    }, []);

    return (
      <div className="relative min-h-screen bg-gray-50 text-[rgb(40,84,48)]">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />

        {/* Top Navigation */}
        <motion.div className="relative z-10 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-md shadow-md border-b border-[rgb(164,190,123)]">
          <div className="flex items-center gap-3">
            <Leaf size={28} className="text-[rgb(95,141,78)]" />
            <h1 className="text-xl font-bold">{role === "farmer" ? "Farmer Dashboard" : "Consumer Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-6">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            </motion.button>
            <motion.div className="flex items-center gap-2 cursor-pointer" whileHover={{ scale: 1.05 }} onClick={() => navigate("/profile")}>
              <User size={24} />
              <span className="hidden sm:inline font-medium">{username}</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-red-600 font-semibold"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("username");
                navigate("/login");
              }}
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <motion.div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-30">
            {actions.map((action) => (
              <motion.div
                key={action.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white rounded-2xl shadow-lg p-7 flex flex-col items-center justify-between text-center border border-[rgb(164,190,123)] transition-shadow hover:shadow-2xl cursor-pointer"
              >
                <div className="flex flex-col justify-center items-center gap-3 ">
                  <div
                    className={`p-4 rounded-full ${
                      role === "farmer"
                        ? "bg-gradient-to-r from-[rgb(95,141,78)] to-[rgb(40,84,48)] text-white"
                        : "bg-[rgb(164,190,123)] text-white"
                    }`}
                  >
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{action.label}</h3>
                  <p className="text-sm text-gray-700">{action.description}</p>
                </div>
                <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (action.label === "Upload Projects") navigate("/upload-projects");
                  if (action.label === "Offer Your Farmland") navigate("/adopt-crop");
                  if (action.label === "View Products") navigate("/consumer-products");
                  if (action.label === "Adopt a Crop") navigate("/consumer-adopt");

                }}
                className={`mt-4 px-4 py-2 rounded-xl font-semibold text-sm ${
                  role === "farmer"
                    ? "bg-gradient-to-r from-[rgb(95,141,78)] to-[rgb(40,84,48)] text-white"
                    : "bg-[rgb(95,141,78)] text-white"
                }`}
              >
                Go
              </motion.button>
              
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  export default Dashboard;
