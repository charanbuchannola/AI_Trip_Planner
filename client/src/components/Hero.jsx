import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  //   const navigate = useNavigate();

  //   const handleButtonClick = () => {
  //     navigate("/create-trip");
  //   };

  return (
    <section className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-red-500 md:text-5xl">
        Discover Your Next Adventure with AI:
      </h1>
      <p className="mt-4 text-2xl font-semibold md:text-3xl">
        Personalized Itineraries at Your Fingertips
      </p>
      <p className="mt-4 text-gray-600">
        Your personal trip planner and travel curator, creating custom
        itineraries tailored to your interests and budget.
      </p>

      <Link to={"/travel-preferences"}>
        <button className="px-6 py-3 mt-6 text-white bg-black rounded-lg hover:bg-gray-800">
          Get Started, It's Free
        </button>
      </Link>
    </section>
  );
};

export default Hero;
