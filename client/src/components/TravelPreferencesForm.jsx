import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { PlanContext } from "./context/TripContext";
import { useNavigate } from "react-router-dom";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelsList,
} from "../constants/Options";
import { chatSession } from "./AIModal";
import Loader from "./Other/Loader";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const TravelPreferencesForm = () => {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [travelGroup, setTravelGroup] = useState("");
  const [errors, setErrors] = useState({});
  const [formdata, setFormData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const { tripPlan, setTripPlan } = useContext(PlanContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/check-auth",
          { withCredentials: true }
        );
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        alert("Please log in to generate a trip.");
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("You must be logged in to generate a trip.");
      return;
    }

    setFormData((prev) => [
      ...prev,
      { destination, days, budget, travelGroup },
    ]);
    console.log(formdata);

    // Validate all fields
    const newErrors = {};
    if (!destination) newErrors.destination = "Destination is required.";
    if (!days) newErrors.days = "Number of days is required.";
    if (!budget) newErrors.budget = "Budget selection is required.";
    if (!travelGroup)
      newErrors.travelGroup = "Travel group selection is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (parseInt(days, 10) > 7) {
      alert(
        "Maximum number of days exceeded! Please choose a shorter trip of atmost 7 days."
      );
      return;
    }

    setErrors({});
    setLoading(true); // Start loading

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", destination)
      .replace("{totalDays}", days)
      .replace("{traveler}", travelGroup)
      .replace("{budget}", budget)
      .replace("{totaldays}", days);

    console.log(FINAL_PROMPT);

    // const result = await chatSession.sendMessage(FINAL_PROMPT);
    // console.log(result?.response?.text());

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const jsonResponse = JSON.parse(result?.response?.text());

      // Save the trip plan in context
      console.log(jsonResponse);
      setTripPlan(jsonResponse);

      navigate("/trip-display");
    } catch (error) {
      console.error("Failed to generate trip plan:", error);
    } finally {
      setLoading(false); // End loading
    }

    // Clear form fields
    setDestination("");
    setDays("");
    setBudget("");
    setTravelGroup("");
  };

  const handleCardClick = (type, value) => {
    if (type === "budget") {
      setBudget(value);
    } else if (type === "travelGroup") {
      setTravelGroup(value);
    }
  };

  return (
      <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-blue-100 to-white shadow-xl rounded-xl">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-600 animate__animated animate__fadeIn animate__delay-0.3s">
          Tell us your travel preferences 🏕️🌴
        </h1>
        <p className="text-center text-gray-600 mb-10 animate__animated animate__fadeIn animate__delay-0.5s">
          Just provide some basic information, and our trip planner will generate
          a customized itinerary based on your preferences.
        </p>
    
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 animate__animated animate__fadeIn animate__delay-0.8s">
            {/* Destination Input */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="destination">
                What is your destination of choice?
              </label>
              <GooglePlacesAutocomplete
                apiKey={API_KEY}
                selectProps={{
                  destination,
                  onChange: (value) => setDestination(value?.label || ""),
                }}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              />
              {errors.destination && (
                <p className="text-red-500 text-sm mt-1 animate__animated animate__fadeIn">{errors.destination}</p>
              )}
            </div>
    
            {/* Days Input */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="days">
                How many days are you planning your trip?
              </label>
              <input
                type="number"
                id="days"
                name="days"
                className={`w-full p-3 border-2 rounded-lg ${errors.days ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out`}
                placeholder="Ex. 3"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
              {errors.days && (
                <p className="text-red-500 text-sm mt-1 animate__animated animate__fadeIn">{errors.days}</p>
              )}
            </div>
    
            {/* Budget Options */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">What is your Budget?</label>
              <div className="grid grid-cols-3 gap-4">
                {SelectBudgetOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleCardClick("budget", option.value)}
                    className={`p-6 cursor-pointer rounded-lg border-2 transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl ${
                      budget === option.value
                        ? "bg-blue-100 border-blue-500 shadow-lg"
                        : "bg-white hover:bg-blue-50"
                    }`}
                  >
                    <p className="text-center text-3xl">{option.icon}</p>
                    <h3 className="text-center font-medium mt-2">{option.label}</h3>
                    <p className="text-center text-gray-500 text-sm">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
    
            {/* Travel Group Options */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Who do you plan on traveling with on your next adventure?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SelectTravelsList.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleCardClick("travelGroup", option.value)}
                    className={`p-6 cursor-pointer rounded-lg border-2 transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl ${
                      travelGroup === option.value
                        ? "bg-blue-100 border-blue-500 shadow-lg"
                        : "bg-white hover:bg-blue-50"
                    }`}
                  >
                    <p className="text-center text-3xl">{option.icon}</p>
                    <h3 className="text-center font-medium mt-2">{option.label}</h3>
                    <p className="text-center text-gray-500 text-sm">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
    
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-4 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              Generate Trip
            </button>
          </form>
        )}
      </div>  
  );
};

export default TravelPreferencesForm;
