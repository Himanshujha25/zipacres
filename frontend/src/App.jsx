import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Dashboard from "./pages/admin/Dashboard";
import AddProperty from "./pages/admin/Addproperty";
import Properties from "./pages/user/Showproperty";
import PropertyDetails from "./pages/user/PropertyDetails";
import ProtectedRoute from "./components/Protectedroute";
import "./index.css"
import Leads from "./pages/admin/Leads";


const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/contact" element={
           <ProtectedRoute roles={["user", "admin"]}>
          <Contact />
          </ProtectedRoute>
          } />
        <Route path="/blog" element={<Blog />} />
        {/* // admin */}
        <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={["admin"]}>
          <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/addProperty" element={
          <ProtectedRoute roles={["admin"]}>
            <AddProperty />
          </ProtectedRoute>
        } />
        {/* user */}
        <Route
        path="/properties"
        element={ <Properties />}
      />
      <Route
        path="/properties/:id"
        element={
          <ProtectedRoute roles={["user", "admin"]}>
            <PropertyDetails />
          </ProtectedRoute>
        }
      />
           <Route
        path="/admin/leads"
        element={
          <ProtectedRoute roles={[ "admin"]}>
            <Leads />
          </ProtectedRoute>
        }
      />

      </Routes>
      <Footer />
    </>
  );
};

export default App;
