import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import FarmerDashboard from "./pages/Dashboard/FarmerDashboard";
import BuyerDashboard from "./pages/Dashboard/BuyerDashboard";
import MarketList from "./pages/Marketplace/MarketList";
import Diagnose from "./pages/Diagnose/Diagnose";

// Simple placeholder components for missing pages
const Profile = () => <div className="p-6">Profile Page - Coming Soon</div>;
const Settings = () => <div className="p-6">Settings Page - Coming Soon</div>;
const Help = () => <div className="p-6">Help Page - Coming Soon</div>;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useState(null); // You'll replace this with actual auth state

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with layout */}
        <Route
          path="/"
          element={
            <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Navigate to="/dashboard" replace />
            </Layout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              {user?.role === "farmer" ? (
                <FarmerDashboard />
              ) : (
                <BuyerDashboard />
              )}
            </Layout>
          }
        />

        <Route
          path="/marketplace"
          element={
            <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <MarketList />
            </Layout>
          }
        />

        <Route
          path="/diagnose"
          element={
            <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Diagnose />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/settings"
          element={
            <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Settings />
            </Layout>
          }
        />

        <Route
          path="/help"
          element={
            <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Help />
            </Layout>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
