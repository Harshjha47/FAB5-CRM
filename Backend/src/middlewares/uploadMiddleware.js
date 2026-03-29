const multer = require("multer");
const AppError = require("../utils/AppError")

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new AppError("Only JPEG, PNG, WebP and PDF images are allowed", 400));
    }
    cb(null, true);
  }
});

module.exports = upload;