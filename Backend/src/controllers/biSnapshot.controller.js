const { computeCrmSnapshot } = require("../services/crmAdapter.service");

const getBiSnapshot = async (req, res) => {
  try {
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
