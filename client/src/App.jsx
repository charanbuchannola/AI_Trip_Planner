import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./components/Register";

import Hero from "./components/Hero";
import TravelPreferencesForm from "./components/TravelPreferencesForm";
import TripPlanDisplay from "./components/TripPlanDisplay";
import LoginForm from "./components/LoginForm";
import { useTheme } from "./components/context/ThemeContext";
import Themes from "./components/Themes/Themes";
import EnhancedTravelForm from "./components/TravelForm";
import Loader from "./components/Loader";

const App = () => {
  const { theme } = useTheme();
  return (
    <div data-theme={theme} className="w-screen h-screen">
      {/* <Loader/> */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/travel-preferences" element={<TravelPreferencesForm />} />
        {/* <Route path="/travel-preferences" element={<EnhancedTravelForm />} /> */}
        <Route path="/trip-display" element={<TripPlanDisplay />} />
      </Routes>
    </div>
  );
};

export default App;
