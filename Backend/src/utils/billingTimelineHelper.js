const buildBillingTimeline = (connection) => {
  // Ensure history is strictly chronological
  const history = [...(connection.history || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

  const timeline = [];

  // The running memory of what the billing state currently is
  let activeState = { bandwidth: null, ratePerMb: null };
  let pendingTransaction = null;
  let activeNoticePeriod = null;

  for (const log of history) {
    const action = log.action;

    // 1. OPENING A TRANSACTION
    if (['CREATED', 'UPGRADE', 'DOWNGRADE', 'RATE_REVISION'].includes(action)) {
      pendingTransaction = {
        type: action,
        initiatedOn: log.date,
        approvedOn: null,
      };
    }

    // 2. APPROVING A TRANSACTION
    if (['APPROVED', 'RATE_REVISION_APPROVED'].includes(action) && pendingTransaction) {
      pendingTransaction.approvedOn = log.date;
    }

    // 3. EXECUTING A TRANSACTION (This is where billing changes)
    if (action === 'ACTIVATED') {
      const liveBandwidth = log.bandwidth || connection.bandwidth;
      const liveRate = log.commercials?.ratePerMb || connection.commercials?.ratePerMb;

      if (pendingTransaction && pendingTransaction.type !== 'CREATED') {
        // It's an Upgrade, Downgrade, or Rate Revision
        timeline.push({
          type: pendingTransaction.type,
          initiatedOn: pendingTransaction.initiatedOn,
          approvedOn: pendingTransaction.approvedOn,
          activatedOn: log.date,
          previous: { ...activeState },
          revised: { bandwidth: liveBandwidth, ratePerMb: liveRate }
        });
      } else if (pendingTransaction?.type === 'CREATED' || timeline.length === 0) {
        // Initial Activation
        timeline.push({
          type: 'ACTIVATED',
          acceptedOn: connection.acceptanceDate,
          activatedOn: log.date,
          bandwidth: liveBandwidth,
          ratePerMb: liveRate,
          serviceType: log.serviceType || connection.serviceType
        });
      }

      // Update our running memory to the new baseline
      activeState = { bandwidth: liveBandwidth, ratePerMb: liveRate };
      pendingTransaction = null; // Clear the queue
    }

    // 4. NOTICE PERIODS
    if (action === 'DISCONNECT_INITIATED' || action === 'NOTICE_PERIOD') { // Adjust to your specific enum if needed
      activeNoticePeriod = {
        type: 'NOTICE_PERIOD',
        raisedOn: log.date,
        finalDate: log.terminationDetails?.finalDate || connection.terminationDetails?.finalDate,
        extensions: []
      };
      timeline.push(activeNoticePeriod);
    }

    // 5. EXTENSIONS
    if (action === 'EXTENDED' && activeNoticePeriod) {
      activeNoticePeriod.extensions.push({
        date: log.date,
        // If your log captures the new date, grab it here, else fallback to connection
        revisedEndDate: log.terminationDetails?.finalDate || connection.terminationDetails?.finalDate
      });
    }

    // 6. RETAINED / CANCELLED
    if (action === 'RETAINED') {
      timeline.push({ type: 'RETAINED', retainedOn: log.date });
      activeNoticePeriod = null;
    }
  }

  // 7. ALWAYS APPEND THE CURRENT STATE AS THE BASELINE (Case 6)
  timeline.push({
    type: 'CURRENT_STATE',
    acceptanceDate: connection.acceptanceDate,
    bandwidth: connection.bandwidth,
    ratePerMb: connection.commercials?.ratePerMb
  });

  return timeline;
};

module.exports = { buildBillingTimeline };