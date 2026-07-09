const express = require("express");
const router = express.Router();
const { requireInternalApiKey } = require("../middlewares/internalAuth.middleware");
const { getBiSnapshot } = require("../controllers/biSnapshot.controller");

// Mount this router at /api/internal in your main app, e.g.:
//   app.use("/api/internal", require("./routes/internalBi.routes"));
//
// Full path becomes: GET /api/internal/bi-snapshot

router.get("/bi-snapshot", requireInternalApiKey, getBiSnapshot);

module.exports = router;
