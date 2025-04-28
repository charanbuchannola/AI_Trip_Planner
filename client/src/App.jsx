import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Other/Navbar";
import Register from "./components/Auth/Register";

import Hero from "./Pages/Hero";
import TravelPreferencesForm from "./components/TravelPreferencesForm";
import TripPlanDisplay from "./components/TripPlanDisplay";

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
        {/* <Route path="/travel-preferences" element={<TravelPreferencesForm />} /> */}
        <Route path="/travel-preferences" element={<EnhancedTravelForm />} />
        <Route path="/trip-display/:tripId" element={<TripPlanDisplay />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
};

export default App;
