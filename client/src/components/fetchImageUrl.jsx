import axios from "axios";

// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { PlanContext } from "../components/TripContext";
// import { useParams } from "react-router-dom";

// const TripPlanDisplay = () => {
//   const { tripId } = useParams(); // Get the tripId from URL params
//   const { tripPlan, setTripPlan } = useContext(PlanContext); // Assuming you have a context that holds trip plan data
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTripDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`/api/trip/${tripId}`);
//         setTripPlan(response.data); // Set the tripPlan data to the context or state
//       } catch (error) {
//         console.error("Error fetching trip details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTripDetails();
//   }, [tripId, setTripPlan]); // Re-fetch if tripId changes

//   if (loading) {
//     return <p className="text-center text-gray-500">Loading trip details...</p>;
//   }

//   if (!tripPlan) {
//     return <p className="text-center text-gray-500">No trip data available.</p>;
//   }

//   const { tripDetails, hotelOptions, itinerary } = tripPlan;

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       {/* Trip Details */}
//       <section className="bg-blue-50 p-4 rounded-lg mb-6">
//         <h2 className="text-2xl font-bold mb-2">Trip Details ✈️</h2>
//         <p>
//           <strong>Location:</strong> {tripDetails.location}
//         </p>
//         <p>
//           <strong>Duration:</strong> {tripDetails.duration}
//         </p>
//         <p>
//           <strong>Travelers:</strong> {tripDetails.travelers}
//         </p>
//         <p>
//           <strong>Budget:</strong> {tripDetails.budget}
//         </p>
//       </section>

//       {/* Hotel Options */}
//       <section className="mb-6">
//         <h2 className="text-2xl font-bold mb-4">Hotel Options 🏨</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {hotelOptions.map((hotel, index) => (
//             <div
//               key={index}
//               className="bg-white shadow-lg rounded-lg overflow-hidden"
//             >
//               <img
//                 src={hotel.hotelImageUrl}
//                 alt={hotel.hotelName}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h3 className="text-xl font-bold">{hotel.hotelName}</h3>
//                 <p className="text-gray-600">{hotel.hotelAddress}</p>
//                 <p className="text-blue-500 font-semibold">{hotel.price}</p>
//                 <p className="text-sm mt-2">{hotel.description}</p>
//                 <p className="text-yellow-500 mt-1">⭐ {hotel.rating}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Itinerary */}
//       <section>
//         <h2 className="text-2xl font-bold mb-4">Itinerary 📅</h2>
//         {Object.keys(itinerary).map((day) => {
//           const { theme, bestTimeToVisit, plan } = itinerary[day];
//           return (
//             <div key={day} className="bg-gray-50 p-4 rounded-lg mb-6">
//               <h3 className="text-xl font-semibold mb-2">Day: {day}</h3>
//               <p>
//                 <strong>Theme:</strong> {theme}
//               </p>
//               <p>
//                 <strong>Best Time to Visit:</strong> {bestTimeToVisit}
//               </p>
//               <div className="mt-4 space-y-4">
//                 {plan.map((place, index) => (
//                   <div
//                     key={index}
//                     className="bg-white shadow-md rounded-lg p-4 flex items-center"
//                   >
//                     <img
//                       src={place.placeImageUrl}
//                       alt={place.placeName}
//                       className="w-24 h-24 rounded-lg object-cover mr-4"
//                     />
//                     <div>
//                       <h4 className="text-lg font-semibold">
//                         {place.placeName}
//                       </h4>
//                       <p className="text-gray-600 text-sm">
//                         {place.placeDetails}
//                       </p>
//                       <p className="text-blue-500 font-semibold">
//                         {place.ticketPricing}
//                       </p>
//                       <p className="text-yellow-500">⭐ {place.rating}</p>
//                       <p className="text-sm text-gray-500">
//                         Travel Time: {place.timeTravel}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </section>
//     </div>
//   );
// };

// export default TripPlanDisplay;





const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Function to search place by name and get photoReference
export const fetchPlaceImage = async (placeName) => {
  try {
    // Step 1: Search place to get place_id
    const searchResponse = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        params: {
          input: placeName,
          inputtype: "textquery",
          fields: "photos,place_id",
          key: API_KEY,
        },
      }
    );

    const candidates = searchResponse.data.candidates;
    if (candidates.length === 0) return null;

    const photoReference = candidates[0]?.photos?.[0]?.photo_reference;

    if (!photoReference) return null;

    // Step 2: Return photo URL
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`;
  } catch (error) {
    console.error("Error fetching place image:", error);
    return null;
  }
};
