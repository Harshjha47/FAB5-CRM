const multer = require("multer");
const AppError = require("../utils/AppError")

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

    if (file.mimetype !== "application/pdf") {
      console.warn("Non PDF file uploaded", file.originalname);
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new AppError("Only PDF files are allowed", 400));
    }
    cb(null, true);
  }
});

module.exports = upload;