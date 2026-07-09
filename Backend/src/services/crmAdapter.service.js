const Customer = require("../models/customerModel");
const Connection = require("../models/connectionModel");
const ServiceRequest = require("../models/requestModel");

/**
 * Computes the CRM BI snapshot for a given day.
 * PURE COMPUTATION ONLY — no database writes. This function has no
 * knowledge of DailyAiSnapshot; that model, and the upsert into it,
 * belong to the BI server under the Federated ETL architecture.
 * This function's only job is: read live CRM data, do the math, return JSON.
 *
 * @param {Date} targetDate - The date to generate the snapshot for (defaults to yesterday)
 * @returns {Promise<{snapshotDate: Date, globalMetrics: object, customers: Array}>}
 */
const computeCrmSnapshot = async (targetDate = new Date(Date.now() - 86400000)) => {
  console.log(`[CRM-ADAPTER] Computing snapshot for ${targetDate.toISOString().split("T")[0]}`);

  // 1. Establish the 24-hour time boundaries for the target day
  const startOfDay = new Date(targetDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // 2. Fetch all active/relevant records
  const customers = await Customer.find({ isActive: true }).lean();
  const connections = await Connection.find({ status: { $ne: "Deleted" } }).lean();
  const requests = await ServiceRequest.find({ status: { $in: ["Pending", "In Progress"] } }).lean();

  // 3. Initialize Global Metric Trackers
  const globalMetrics = {
    totalActiveConnections: 0,
    totalMrc: 0,
    totalMarginMrc: 0,
    connectionsByStatus: {},
    newActivationsToday: 0,
    disconnectionsToday: 0,
    totalProvisioningDays: 0,
    provisioningCount: 0,
    totalDisconnectionDays: 0,
    disconnectionCount: 0,
  };

  const customerSnapshots = [];

  // 4. Group & Calculate (The Math Layer)
  for (const customer of customers) {
    const custConnections = connections.filter((c) => c.customer.toString() === customer._id.toString());
    const custRequests = requests.filter((r) => r.customer.toString() === customer._id.toString());

    if (custConnections.length === 0 && custRequests.length === 0) continue; // Skip quiet accounts

    const connectionSnapshots = [];

    for (const conn of custConnections) {
      // --- A. Status Grouping ---
      globalMetrics.connectionsByStatus[conn.status] = (globalMetrics.connectionsByStatus[conn.status] || 0) + 1;

      // --- B. Financial Math ---
      const mrc = Number(conn.commercials?.mrc || 0);
      const providerMrc = Number(conn.providerCost?.mrc || 0);
      const margin = mrc - providerMrc;

      if (conn.status === "Active") {
        globalMetrics.totalActiveConnections += 1;
        globalMetrics.totalMrc += mrc;
        globalMetrics.totalMarginMrc += margin;
      }

      // --- C. Event Deltas (Last 24 Hours) ---
      const eventsToday = [];
      let provDays = null;
      let discDays = null;

      if (conn.history && conn.history.length > 0) {
        conn.history.forEach((hist) => {
          const histDate = new Date(hist.date);
          if (histDate >= startOfDay && histDate <= endOfDay) {
            eventsToday.push({
              action: hist.action,
              date: hist.date,
              note: hist.note,
            });

            if (hist.action === "ACTIVATED") globalMetrics.newActivationsToday += 1;

            // FIX: schema's actual terminal-state action is "TERMINATED",
            // not "DISCONNECTED" (which doesn't exist in the enum) —
            // the old check silently never matched this case.
            if (["TERMINATED", "CANCELLED"].includes(hist.action)) {
              globalMetrics.disconnectionsToday += 1;
            }
          }
        });

        // --- Provisioning turnaround: CREATED -> ACTIVATED ---
        const createdEvent = conn.history.find((h) => h.action === "CREATED");
        const activatedEvent = conn.history.find((h) => h.action === "ACTIVATED");

        if (createdEvent && activatedEvent) {
          provDays = Math.ceil((new Date(activatedEvent.date) - new Date(createdEvent.date)) / (1000 * 60 * 60 * 24));

          if (eventsToday.some((e) => e.action === "ACTIVATED")) {
            globalMetrics.totalProvisioningDays += provDays;
            globalMetrics.provisioningCount += 1;
          }
        }

        // --- FIX: Disconnection turnaround was never computed ---
        // DISCONNECT_INITIATED -> TERMINATED
        const discInitiatedEvent = conn.history.find((h) => h.action === "DISCONNECT_INITIATED");
        const terminatedEvent = conn.history.find((h) => h.action === "TERMINATED");

        if (discInitiatedEvent && terminatedEvent) {
          discDays = Math.ceil(
            (new Date(terminatedEvent.date) - new Date(discInitiatedEvent.date)) / (1000 * 60 * 60 * 24)
          );

          if (eventsToday.some((e) => e.action === "TERMINATED")) {
            globalMetrics.totalDisconnectionDays += discDays;
            globalMetrics.disconnectionCount += 1;
          }
        }
      }

      // --- D. Reason Signals (constrained text, from rejection/termination) ---
      // Note: raw free-text reasons only — categorization into a fixed
      // taxonomy (PRICE, RELOCATION, SERVICE_QUALITY, etc.) happens on
      // the BI server side via the constrained classifier, not here.
      // This adapter's job is to surface the raw evidence, not classify it.
      const reasonSignals = [];

      if (conn.rejectionDetails?.reason && conn.rejectionDetails?.rejectedAt) {
        const rejectedAt = new Date(conn.rejectionDetails.rejectedAt);
        if (rejectedAt >= startOfDay && rejectedAt <= endOfDay) {
          reasonSignals.push({
            source: "REJECTION",
            category: null, // filled in later by classifier
            evidenceSnippet: conn.rejectionDetails.reason.slice(0, 300),
            date: conn.rejectionDetails.rejectedAt,
          });
        }
      }

      if (conn.terminationDetails?.reason && conn.terminationDetails?.raiseDate) {
        const raiseDate = new Date(conn.terminationDetails.raiseDate);
        if (raiseDate >= startOfDay && raiseDate <= endOfDay) {
          reasonSignals.push({
            source: "DISCONNECTION",
            category: null,
            evidenceSnippet: conn.terminationDetails.reason.slice(0, 300),
            date: conn.terminationDetails.raiseDate,
          });
        }
      }

      // Construct Connection Grain
      connectionSnapshots.push({
        connectionId: conn._id,
        opportunityId: conn.opportunityId,
        state: {
          status: conn.status,
          serviceType: conn.serviceType,
          telcoProvider: conn.technicalDetails?.telcoProvider,
          bandwidth: conn.bandwidth,
          commercials: { mrc, otc: Number(conn.commercials?.otc || 0) },
          providerCost: { mrc: providerMrc },
          marginMrc: margin,
          ipsCount: Number(conn.ips?.count || 0),
          ipsCost: Number(conn.ips?.cost || 0),
        },
        eventsToday: {
          actions: eventsToday,
          turnaroundDays: { provisioning: provDays, disconnection: discDays },
        },
        reasonSignals,
      });
    }

    // Format open requests (Pipeline) — including churn reason as its own signal
    const openRequests = custRequests.map((r) => ({
      requestId: r._id,
      requestType: r.requestType,
      status: r.status,
      raisedDate: r.createdAt,
    }));

    // Construct Customer Container
    customerSnapshots.push({
      customerId: customer._id,
      customerName: customer.name,
      customerType: customer.customerType,
      state: customer.billingProfile?.[0]?.address?.state || "Unknown",
      managedBy: customer.managedBy,
      crmData: {
        connections: connectionSnapshots,
        pipeline: { openRequests },
      },
    });
  }

  // 5. Finalize Global Averages
  globalMetrics.avgProvisioningTurnaroundDays =
    globalMetrics.provisioningCount > 0
      ? Number((globalMetrics.totalProvisioningDays / globalMetrics.provisioningCount).toFixed(1))
      : null;

  globalMetrics.avgDisconnectionTurnaroundDays =
    globalMetrics.disconnectionCount > 0
      ? Number((globalMetrics.totalDisconnectionDays / globalMetrics.disconnectionCount).toFixed(1))
      : null;

  delete globalMetrics.totalProvisioningDays;
  delete globalMetrics.provisioningCount;
  delete globalMetrics.totalDisconnectionDays;
  delete globalMetrics.disconnectionCount;

  console.log(`[CRM-ADAPTER] Computed: ${globalMetrics.totalActiveConnections} active connections, ${customerSnapshots.length} customers with activity.`);

  // 6. Return pure JSON — no DB write. The BI server's cron job is
  // responsible for the upsert into its own DailyAiSnapshot collection.
  return {
    snapshotDate: startOfDay,
    globalMetrics,
    customers: customerSnapshots,
  };
};

module.exports = { computeCrmSnapshot };
