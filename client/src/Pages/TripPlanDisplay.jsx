import React, { useEffect, useState, useContext } from "react";
// import { Rating } from "@material-tailwind/react";

import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaSun,
  FaLandmark,
  FaMap,
} from "react-icons/fa";
import { PlanContext } from "../components/context/TripContext";
import { axiosInstance } from "../components/Axios/axios";
import Loader from "../components/Other/Loader";

const TripPlanDisplay = () => {
  const { tripId } = useParams();
  console.log(tripId);
  const { tripPlan, setTripPlan } = useContext(PlanContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // State for collapsible itinerary
  const [openDay, setOpenDay] = useState(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        navigate("/login");
        return;
      }
      setLoading(true);

      try {
        const response = await axiosInstance.get("/tripplan/${tripId}", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response);

        const { trip } = response.data;

        setTripPlan({
          generatedPlan: trip.generatedPlan,
          tripDetails: {
            location: trip.destination,
            duration: trip.days + " days",
            travelers: trip.travelGroup,
            budget: trip.budget,
          },
        });
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, setTripPlan, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (!tripPlan) {
    return <p className="text-center text-gray-500">No trip data available.</p>;
  }

  const { generatedPlan } = tripPlan;
  console.log(tripPlan);
  const { hotelOptions, itinerary } = generatedPlan || {};

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotate: 1 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
 <div className=" max-h-screen overflow-x-hidden relative">
     <div className="max-w-7xl mt-15 mx-auto py-12 px-6">
      {/* Trip Details */}
      <motion.section
        className="card bg-base-100 shadow-2xl mb-10 rounded-2xl border border-base-300 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="card-body p-8">
          <h2 className="text-4xl font-extrabold mb-6 flex items-center">
            <FaMapMarkerAlt className="mr-3" /> Your Bali Adventure ✈
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-2">
              <span className="badge bg-base-300">Destination</span>
              <p className="font-semibold">{tripPlan?.destination}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="badge bg-base-300">Duration</span>
              <p className="font-semibold">{tripPlan?.days} Days</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="badge bg-base-300">Travelers</span>
              <p className="font-semibold">{tripPlan?.travelGroup}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="badge bg-base-300">Budget</span>
              <p className="font-semibold">{tripPlan?.budget}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Hotel Options */}
      <section className="mb-12 ">
        <h2 className="text-4xl font-extrabold mb-8 flex items-center">
          <FaStar className="mr-3" /> Luxurious Stays 🏨
        </h2>
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {hotelOptions?.map((hotel, index) => (
            <motion.div
              key={index}
              className="card bg-base-100 shadow-xl rounded-2xl overflow-hidden border border-base-300"
              variants={cardVariants}
              whileHover="hover"
            >
              <figure className="relative">
                <img
                  src={hotel.hotelImageUrl}
                  alt={hotel.hotelName}
                  className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 right-4 badge bg-base-300">
                  {hotel.rating} <FaStar className="ml-1" />
                </div>
              </figure>
              <div className="card-body p-6">
                <h3 className="text-2xl font-bold">{hotel.hotelName}</h3>
                <p className="flex items-center mt-2">
                  <FaMapMarkerAlt className="mr-2" /> {hotel.hotelAddress}
                </p>
                <p className="font-semibold text-lg mt-2 flex items-center">
                  <FaDollarSign className="mr-2" /> {hotel.price}
                </p>
                <p className="text-sm mt-3 line-clamp-2">{hotel.description}</p>
                <div className="card-actions mt-4 flex justify-between">
                  <motion.button
                    className="btn bg-base-300 rounded-full px-6"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Book Now
                  </motion.button>
                  <motion.button
                    className="btn bg-base-300 rounded-full px-6"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FaMap className="mr-2" /> View Map
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <h2 className="text-4xl font-extrabold mb-8 flex items-center">
          <FaClock className="mr-3" /> Your Itinerary 📅
        </h2>
        {itinerary &&
          Object.keys(itinerary).map((day) => {
            const { theme, bestTimeToVisit, plan } = itinerary[day];
            return (
              <motion.div
                key={day}
                className="collapse bg-base-100 shadow-xl mb-6 rounded-2xl border border-base-300"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <input
                  type="checkbox"
                  checked={openDay === day}
                  onChange={() => setOpenDay(openDay === day ? null : day)}
                />
                <div className="collapse-title bg-base-200 text-2xl font-semibold flex justify-between items-center p-6">
                  <span className="flex items-center">
                    {theme === "Beach and Relaxation" ? (
                      <FaSun className="mr-2" />
                    ) : (
                      <FaLandmark className="mr-2" />
                    )}
                    Day {day}: {theme}
                  </span>
                  <span className="badge bg-base-300">
                    {openDay === day ? "Collapse" : "Expand"}
                  </span>
                </div>
                <AnimatePresence>
                  {openDay === day && (
                    <motion.div
                      className="collapse-content p-6"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <p className="mb-6 font-semibold">
                        <strong>Best Time to Visit:</strong> {bestTimeToVisit}
                      </p>
                      <ul className="timeline timeline-vertical">
                        {plan?.map((place, index) => (
                          <li key={index} className="relative">
                            <div className="timeline-middle">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-6 w-6 text-base-content"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <motion.div
                              className={`timeline-${
                                index % 2 === 0 ? "start" : "end"
                              } card bg-base-100 shadow-lg rounded-xl p-5 hover:bg-base-200 transition-colors w-full max-w-md lg:max-w-lg mx-4 my-2`}
                              variants={cardVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <div className="flex items-start space-x-4">
                                <img
                                  src={place.placeImageUrl}
                                  alt={place.placeName}
                                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold">
                                    {place.placeName}
                                  </h4>
                                  <p className="text-sm mt-1 line-clamp-2">
                                    {place.placeDetails}
                                  </p>
                                  <div className="flex items-center space-x-3 mt-2">
                                    <span className="badge bg-base-300 text-sm">
                                      {place.ticketPricing}
                                    </span>
                                    <span className="badge bg-base-300 flex items-center text-sm">
                                      {[...Array(5)].map((_, i) => (
                                        <FaStar
                                          key={i}
                                          className={`h-3 w-3 ${
                                            i < Math.round(place.rating)
                                              ? ""
                                              : "opacity-30"
                                          }`}
                                        />
                                      ))}
                                      <span className="ml-1">
                                        ({place.rating})
                                      </span>
                                    </span>
                                  </div>
                                  <p className="text-sm flex items-center mt-2">
                                    <FaClock className="mr-2" /> Travel Time:{" "}
                                    {place.timeTravel}
                                  </p>
                                  <motion.button
                                    className="btn bg-base-300 rounded-full px-4 mt-3 text-sm"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                  >
                                    <FaMap className="mr-2" /> View Map
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                            {index < plan.length - 1 && (
                              <hr className="bg-base-300 h-1 w-1/2 mx-auto" />
                            )}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
      </section>
    </div>
 </div>
  );
};

export default TripPlanDisplay;
