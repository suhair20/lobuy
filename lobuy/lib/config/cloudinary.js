import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfig() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
  });
  configured = true;
}

export default new Proxy(cloudinary, {
  get(target, prop) {
    ensureConfig();
    const value = target[prop];
    return typeof value === "function" ? value.bind(target) : value;
  },
});
