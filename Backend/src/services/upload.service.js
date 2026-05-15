const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (file, folder = "crm") => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer || file.size === 0 || file.buffer.length === 0) {
      return reject(new Error("Empty file. Please cehck the file and try again"));
    }
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        access_mode: "public"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};