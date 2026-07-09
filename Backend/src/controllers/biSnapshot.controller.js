const { computeCrmSnapshot } = require("../services/crmAdapter.service");

/**
 * GET /api/internal/bi-snapshot
 * GET /api/internal/bi-snapshot?date=2026-07-08
 *
 * Called by the BI Server's 3:00 AM cron job. Returns pure, structured
 * JSON — this route does NOT write to any BI database. The CRM app has
 * no knowledge of DailyAiSnapshot; storing the result is entirely the
 * BI Server's responsibility once it receives this response.
 */
const getBiSnapshot = async (req, res) => {
  try {
    // Optional ?date=YYYY-MM-DD query param lets the BI server backfill
    // a specific day (e.g. re-running a failed night) instead of only
    // ever being able to fetch "yesterday".
    let targetDate;
    if (req.query.date) {
      const parsed = new Date(req.query.date);
      if (isNaN(parsed.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid 'date' query param. Expected format: YYYY-MM-DD.",
        });
      }
      targetDate = parsed;
    }

    const snapshot = targetDate ? await computeCrmSnapshot(targetDate) : await computeCrmSnapshot();

    return res.status(200).json({
      success: true,
      source: "connect-crm",
      data: snapshot,
    });
  } catch (error) {
    console.error("[BI-SNAPSHOT-CONTROLLER] Failed to compute snapshot:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to compute CRM BI snapshot.",
    });
  }
};

module.exports = { getBiSnapshot };
