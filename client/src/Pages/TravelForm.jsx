import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plane, Wallet, Users, MapPin, Calendar } from "lucide-react";
import Loader from "../components/Other/Loader";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import TiltedCard from "../components/ui/ReactBIt/TiltedCard";
import { useNavigate } from "react-router-dom";

export default function EnhancedTravelForm() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [travelGroup, setTravelGroup] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY; // Replace with your actual API key

  const SelectBudgetOptions = [
    {
      id: 1,
      value: "budget",
      icon: "https://i.pinimg.com/736x/54/0a/de/540adeb04c6097f94fb20a2232869166.jpg",
      label: "Budget",
      description: "Affordable options",
    },
    {
      id: 2,
      value: "moderate",
      icon: "https://i.pinimg.com/736x/a8/0c/e9/a80ce9b1eaf3aff679b4c0afac00688c.jpg",
      label: "Moderate",
      description: "Mid-range comfort",
    },
    {
      id: 3,
      value: "luxury",
      icon: "https://i.pinimg.com/736x/0d/d0/86/0dd086ad5519a3133ffa6b08d81ee0b0.jpg",
      label: "Luxury",
      description: "Premium experience",
    },
  ];

  const SelectTravelsList = [
    {
      id: 1,
      value: "solo",
      icon: "https://i.pinimg.com/736x/9f/9b/a6/9f9ba670e6cfb23b91953f5f67ddd46a.jpg",
      label: "Solo",
      description: "Just me",
    },
    {
      id: 2,
      value: "couple",
      icon: "https://i.pinimg.com/736x/12/eb/13/12eb134d96d33d1a4fc5010624788097.jpg",
      label: "Couple",
      description: "Romantic getaway",
    },
    {
      id: 3,
      value: "family",
      icon: "https://i.pinimg.com/736x/2c/a8/6b/2ca86ba7d8454054d0ad1e472423ba3a.jpg",
      label: "Family",
      description: "With kids",
    },
    {
      id: 4,
      value: "friends",
      icon: "https://i.pinimg.com/736x/0d/47/8e/0d478e2c7000ef5d6b9becbb5bcd838a.jpg",
      label: "Friends",
      description: "Group adventure",
    },
  ];

  const handleCardClick = (type, value) => {
    if (type === "budget") {
      setBudget(value);
      setErrors({ ...errors, budget: "" });
    } else if (type === "travelGroup") {
      setTravelGroup(value);
      setErrors({ ...errors, travelGroup: "" });

    }
  };

  const validate = () => {
    const newErrors = {};
    if (!destination) newErrors.destination = "Please select a destination";
    if (!days) newErrors.days = "Please enter number of days";
    if (!budget) newErrors.budget = "Please select a budget option";
    if (!travelGroup)
      newErrors.travelGroup = "Please select who you are traveling with";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Mock API call
    setTimeout(() => {
      console.log({ destination, days, budget, travelGroup });
      setLoading(false);
      // Navigation or success handling would go here
    }, 1500);
    navigate("/trip-display");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className=" overflow-x-hidden max-h-screen  md:flex w-full py-12 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto  shadow-2xl rounded-3xl mt-20 overflow-x-hidden overflow-y-scroll"
      >
        {/* Hero Banner */}
        <div className=" p-8  relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute w-40 h-40 rounded-full  top-4 right-4"></div>
            <div className="absolute w-20 h-20 rounded-full  bottom-4 left-10"></div>
            <div className="absolute w-32 h-32 rounded-full  right-1/3"></div>
          </div>

          <motion.div variants={itemVariants} className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <Plane className="w-8 h-8 mr-3 inline" />
              Travel Preferences
            </h1>
            <p className="text-lg opacity-90 max-w-lg">
              Tell us about your dream vacation and we'll create the perfect
              itinerary tailored just for you
            </p>
          </motion.div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {loading ? (
            <Loader />
          ) : (
            <motion.form
              variants={containerVariants}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/*  both days and destination */}

              <div className="md:flex items-center justify-between gap-4">
                {/* Destination Input */}
                <motion.div
                  variants={itemVariants}
                  className="w-full md:w-1/2 form-control"
                >
                  <label className="label">
                    <span className="label-text text-lg flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                      Destination
                    </span>
                  </label>

                  <div
                    className={`relative w-full ${
                      errors.destination
                        ? "tooltip tooltip-open tooltip-error"
                        : ""
                    }`}
                    data-tip={errors.destination}
                  >
                   
                    <GooglePlacesAutocomplete
                  apiKey={API_KEY}
                  selectProps={{
                    destination,
                    onChange: (value) => setDestination(value?.label || ""),
                   value: destination,
                        styles: {
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "transparent",
                            border: "0.2px solid ", // gray-300
                            boxShadow: "none",
                            width: "100%", // force full width
                            minHeight: "2.5rem", // match Tailwind input height
                            borderRadius: "0.5rem", // rounded-md
                            paddingLeft: "0.75rem", // pl-3
                            paddingRight: "0.75rem", // pr-3
                          }),
                          placeholder: (provided) => ({
                            ...provided,
                            color: "#9ca3af",
                            fontSize: "1em", // gray-400
                          }),
                          input: (provided) => ({
                            ...provided,
                            color: "#FFDBDB",
                          }),
                        
                        },
                      }}

                    />
                  </div>
                  {
                        console.log(destination)
                    }
                </motion.div>

                {/* Days Input */}
                <motion.div
                  variants={itemVariants}
                  className="w-full md:w-1/2  mt-5 md:mt-0 form-control"
                >
                  <label className="label">
                    <span className="label-text text-lg flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                      Duration
                    </span>
                  </label>

                  <div
                    className={`relative ${
                      errors.days ? "tooltip tooltip-open tooltip-error" : ""
                    }`}
                    data-tip={errors.days}
                  >
                    <select
                      className="select select-bordered w-full focus:select-primary"
                      value={days || "1"}
                      onChange={(e) => setDays(e.target.value)}
                    >
                      <option value="" disabled>
                        Select number of days
                      </option>
                      {[...Array(7)].map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1} {index + 1 === 1 ? "day" : "days"}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              </div>

              {/* Budget Options */}
              <motion.div variants={itemVariants} className="form-control">
                <label className="label">
                  <span className="label-text text-lg flex items-center">
                    <Wallet className="w-5 h-5 mr-2 text-blue-500" />
                    Budget
                  </span>
                </label>
                <div
                  className={`${
                    errors.budget ? "tooltip tooltip-open tooltip-error" : ""
                  }`}
                  data-tip={errors.budget}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {SelectBudgetOptions.map((option) => (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        key={option.id}
                        onClick={() => handleCardClick("budget", option.value)}
                        className={`card cursor-pointer transition-all ${
                          budget === option.value
                            ? "-blue-50 border-2 border-blue-500 shadow-md"
                            : " hover:shadow-md"
                        }`}
                      >
                        {/* <div className="card-body items-center text-center p-4">
                          {option.icon}
                          <h3 className="card-title text-lg mt-2">
                            {option.label}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {option.description}
                          </p>
                        </div> */}

<div className="  items-center text-center p-4">
                          <TiltedCard
                            className="object-cover "
                            imageSrc={option.icon}
                            altText={option.description}
                            captionText={option.label}
                            containerHeight="200px"
                            containerWidth="200px"
                            imageHeight="200px"
                            imageWidth="200px"
                            rotateAmplitude={12}
                            scaleOnHover={1}
                            showMobileWarning={false}
                            showTooltip={true}
                            displayOverlayContent={true}
                            overlayContent={
                              <p className="tilted-card-demo-text">
                                {option.label}
                                <br />
                                {option.description}
                              </p>
                            }
                          />
                        </div>
                        
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Travel Group Options */}
              <motion.div variants={itemVariants} className="form-control">
                <label className="label">
                  <span className="label-text text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    Travel Group
                  </span>
                </label>
                <div
                  className={`${
                    errors.travelGroup
                      ? "tooltip tooltip-open tooltip-error"
                      : ""
                  }`}
                  data-tip={errors.travelGroup}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {SelectTravelsList.map((option) => (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        key={option.id}
                        onClick={() =>
                          handleCardClick("travelGroup", option.value)
                        }
                        className={` cursor-pointer transition-all rounded  ${
                          travelGroup === option.value
                            ? " border-2 border-blue-500 shadow-md"
                            : " hover:shadow-md"
                        }`}
                      >
                        {/* <div className="card-body items-center text-center p-4">
                          {option.icon}
                          <h3 className="card-title text-md mt-1">
                            {option.label}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {option.description}
                          </p>
                        </div> */}

                        <div className="  items-center text-center p-4">
                          <TiltedCard
                            className="object-cover "
                            imageSrc={option.icon}
                            altText={option.description}
                            captionText={option.label}
                            containerHeight="150px"
                            containerWidth="150px"
                            imageHeight="150px"
                            imageWidth="150px"
                            rotateAmplitude={12}
                            scaleOnHover={1}
                            showMobileWarning={false}
                            showTooltip={true}
                            displayOverlayContent={true}
                            overlayContent={
                              <p className="tilted-card-demo-text">
                                {option.label}
                                <br />
                                {option.description}
                              </p>
                            }
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-primary w-full py-3 text-lg font-medium"
                >
                  <Plane className="w-5 h-5 mr-2" /> Generate My Trip
                </motion.button>
              </motion.div>
            </motion.form>
          )}
        </div>
      </motion.div>

      {/* Google maps */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl mx-auto -white shadow-2xl  mt-20 overflow-hidden relative"
      >
        {/* <img
          src="https://i.pinimg.com/736x/f9/af/73/f9af73ea72f0f484bf2c9c00a7a1a1d2.jpg"
          className="object-cover w-full h-full"
          alt=""
        /> */}

        <TiltedCard
          className="object-cover "
          imageSrc="https://i.pinimg.com/736x/f9/af/73/f9af73ea72f0f484bf2c9c00a7a1a1d2.jpg"
          altText="maps "
          captionText="Ai Trpi Planner"
          containerHeight="100%"
          containerWidth="100%"
          imageHeight="100%"
          imageWidth="500px"
          rotateAmplitude={12}
          scaleOnHover={1}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          overlayContent={<p className="tilted-card-demo-text"></p>}
        />
      </motion.div>
    </div>
  );
}
