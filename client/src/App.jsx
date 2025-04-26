import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./components/Register";

import Hero from "./components/Hero";
import TravelPreferencesForm from "./components/TravelPreferencesForm";
import TripPlanDisplay from "./components/TripPlanDisplay";
import LoginForm from "./components/LoginForm";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/travel-preferences" element={<TravelPreferencesForm />} />
        <Route path="/trip-display" element={<TripPlanDisplay />} />
      </Routes>
    </>
  );
};

export default App;
