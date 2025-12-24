import cloudinary from "cloudinary";

// ✅ Cloudinary configuration (NO dotenv)
cloudinary.config({
  cloud_name: "deycoakds",              // from your dashboard
  api_key: "292799781528949",           // replace with your API Key
  api_secret: "JUsN1mxwkvrouyUeS62m5BOzBYg",   // replace with your API Secret
});

export default cloudinary;
