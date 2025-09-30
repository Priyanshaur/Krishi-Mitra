import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice' // adjust path if needed
import {
  Leaf,
  BarChart3,
  Cpu,
  MessageSquare,
  Satellite,
  Database,
  TrendingUp,
  Image as ImageIcon,
  Bluetooth,
  Users,
  Sprout
} from "lucide-react";

const HomePage = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const { isAuthenticated } = useSelector((state) => state.auth)   // ✅ FIX

  // Key Modules of the Project
  const features = [
    {
      icon: <ImageIcon className="h-8 w-8" />,
      title: "AI Disease Detection",
      description:
        "Upload crop images to detect plant diseases using our CNN-based image classification model."
    },
    {
      icon: <Bluetooth className="h-8 w-8" />,
      title: "Smart Soil Node",
      description:
        "ESP32-powered node collects real-time soil moisture and environment data to guide irrigation."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Farmer Marketplace",
      description:
        "Direct B2B platform connecting farmers to buyers with transparent pricing and quality checks."
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Predictive Analytics",
      description:
        "AI models forecast yield and warn of possible pest outbreaks using soil + climate data."
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Multilingual AI Assistant",
      description:
        "Conversational chatbot provides guidance in multiple Indian languages for farmers of all literacy levels."
    },
    {
      icon: <Satellite className="h-8 w-8" />,
      title: "Future Expansion",
      description:
        "Satellite & drone imagery integration planned for large-scale farm diagnostics."
    }
  ];

  const stats = [
    { number: "95%", label: "Disease Detection Accuracy" },
    { number: "10K+", label: "Farmers Reached" },
    { number: "5+", label: "Languages Supported" },
    { number: "∞", label: "Opportunities to Grow" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* NAVBAR */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Krishi Mitra
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
              <a href="#methodology" className="text-gray-600 hover:text-green-600 transition-colors">Methodology</a>
              <a href="#future" className="text-gray-600 hover:text-green-600 transition-colors">Future Scope</a>
            </div>

            <div className="flex items-center space-x-4">
  {isAuthenticated ? (
    <>
      <Link
        to="/dashboard"
        className="text-green-600 hover:text-green-700 font-medium"
      >
        Dashboard
      </Link>
      <button
        onClick={() => dispatch(logout())}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className="text-green-600 hover:text-green-700 font-medium"
      >
        Sign In
      </Link>
      <Link
        to="/register"
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
      >
        Get Started
      </Link>
    </>
  )}
</div>


          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4 mr-2" />
              Empowering Farmers with AI & IoT
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Smarter Agriculture for a Sustainable <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">Tomorrow</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Krishi Mitra is a unified platform combining AI disease detection, IoT-based soil monitoring,
              predictive analytics, and a farmer-to-buyer marketplace to revolutionize Indian agriculture.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Sprout className="h-5 w-5 text-green-500 mr-2" />
                Built for small & large farms alike
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-500 mr-2" />
                Farmer-friendly interface
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl shadow-lg w-full h-80 flex items-center justify-center">
                <div className="text-center p-8">
                  <Leaf className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">Krishi Mitra Platform</h3>
                  <p className="text-gray-600 mt-2">AI + IoT for Next-Gen Farming</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Modules</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each feature is designed to solve real challenges faced by Indian farmers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                  currentFeature === index ? "border-green-500" : "border-transparent"
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section id="methodology" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Project Methodology</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Krishi Mitra is developed in phases: <br />
            <span className="font-semibold">Phase I</span> - Research & Data Gathering •
            <span className="font-semibold"> Phase II</span> - CNN Model & Smart Node •
            <span className="font-semibold"> Phase III</span> - Marketplace & Dashboard •
            <span className="font-semibold"> Phase IV</span> - AI Assistant •
            <span className="font-semibold"> Phase V</span> - Integration & Testing.
          </p>
        </div>
      </section>

      {/* FUTURE SCOPE */}
      <section id="future" className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Future Scope</h2>
          <p className="text-lg mb-6">
            Upcoming enhancements include drone-based farm diagnostics, voice-based offline AI support,
            and large-scale government/NGO integrations for real deployment.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <p className="mb-2">&copy; 2024 Krishi Mitra. All rights reserved.</p>
        <p>Built with ❤️ for Indian Agriculture</p>
      </footer>
    </div>
  );
};

export default HomePage;
