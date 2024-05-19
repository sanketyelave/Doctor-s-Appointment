import React from "react";
import { Routes, Route } from "react-router-dom";
import Appointment from "./pages/Appointment";
import AboutUs from "./pages/AboutUs";
import Doctors from "./pages/Doctors";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppointmentBox from "./pages/AppointmentBox";
import Department from "./pages/departments/DepartmentDynamic";
import UserView from "./pages/UserView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/myinfo" element={<UserView />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/appointment-box" element={<AppointmentBox />} />
      <Route path="/dynamic/:segment" element={<Department />} />
    </Routes>
  );
}

export default App;
