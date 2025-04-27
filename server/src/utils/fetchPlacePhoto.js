const axios = require("axios");

module.exports.fetchPlacePhoto = async function (placeName) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_API_KEY is missing");
      return null;
    }

    console.log("Fetching photo for:", placeName);

    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      placeName
    )}&inputtype=textquery&fields=photos&key=${apiKey}`;

    const searchResponse = await axios.get(searchUrl);
    console.log("Google API Response:", searchResponse.data);

    const candidate = searchResponse.data.candidates?.[0];
    const photoReference = candidate?.photos?.[0]?.photo_reference;

    if (photoReference) {
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
      const photoResponse = await axios.get(photoUrl, {
        maxRedirects: 0,
        validateStatus: null,
      });

      console.log("Photo Response Headers:", photoResponse.headers);

      const finalImageUrl = photoResponse.headers.location;
      return finalImageUrl || null;
    } else {
      console.warn(`No photo found for: ${placeName}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching place photo:", error.message);
    return null;
  }
};