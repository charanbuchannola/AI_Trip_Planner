import React, { useEffect, useState, useContext } from "react";
import { PlanContext } from "../components/context/TripContext";

import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Other/Loader";
import { axiosInstance } from "../components/Axios/axios";

const TripPlanDisplay = () => {
  const { tripId } = useParams();
  console.log(tripId);
  const { tripPlan, setTripPlan } = useContext(PlanContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        const response = await axiosInstance.get(
          `tripplan/${tripId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
    return (
      <Loader/>
    );
  }

  if (!tripPlan) {
    return <p className="text-center text-gray-500">No trip data available.</p>;
  }

  const { tripDetails, generatedPlan } = tripPlan;
  const { hotelOptions, itinerary } = generatedPlan || {};

  return (
    <div className="max-w-6xl mx-auto px-6 pt-20 overflow-x-hidden">
    {/* Trip Details */}
    <section className="bg-blue-100 p-6 rounded-2xl mb-10 shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-blue-800">Trip Details ✈️</h2>
      <div className="space-y-2 text-gray-700 text-lg">
        <p><strong>Location:</strong> {tripDetails?.location}</p>
        <p><strong>Duration:</strong> {tripDetails?.duration}</p>
        <p><strong>Travelers:</strong> {tripDetails?.travelers}</p>
        <p><strong>Budget:</strong> {tripDetails?.budget}</p>
      </div>
    </section>
  
    {/* Hotel Options */}
    <section className="mb-10">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Hotel Options 🏨</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hotelOptions?.map((hotel, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={hotel.hotelImageUrl}
              alt={hotel.hotelName}
              className="w-full h-52 object-cover"
            />
            <div className="p-5 space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">{hotel.hotelName}</h3>
              <p className="text-gray-500">{hotel.hotelAddress}</p>
              <p className="text-blue-600 font-semibold">{hotel.price}</p>
              <p className="text-gray-600">{hotel.description}</p>
              <p className="text-yellow-500">⭐ {hotel.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  
    {/* Itinerary */}
    <section>
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Itinerary 📅</h2>
      <div className="space-y-8">
        {itinerary &&
          Object.keys(itinerary).map((day) => {
            const { theme, bestTimeToVisit, plan } = itinerary[day];
            return (
              <div key={day} className="bg-gray-100 p-6 rounded-2xl shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Day: {day}</h3>
                <div className="space-y-2 text-gray-700 text-lg">
                  <p><strong>Theme:</strong> {theme}</p>
                  <p><strong>Best Time to Visit:</strong> {bestTimeToVisit}</p>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {plan?.map((place, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition-all duration-300 flex gap-4 items-start"
                    >
                      <img
                        src={place.placeImageUrl}
                        alt={place.placeName}
                        className="w-28 h-28 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-1">
                        <h4 className="text-xl font-bold text-gray-800">{place.placeName}</h4>
                        <p className="text-gray-600 text-sm">{place.placeDetails}</p>
                        <p className="text-blue-600 font-semibold">{place.ticketPricing}</p>
                        <p className="text-yellow-500">⭐ {place.rating}</p>
                        <p className="text-gray-500 text-sm">Travel Time: {place.timeTravel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  </div>
  
  );
};

export default TripPlanDisplay;
