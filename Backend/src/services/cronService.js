const cron = require('node-cron');
const Connection = require('../models/connectionModel');
const logger = require('../utils/logger');
const { sendViaEmailJS } = require('../services/sendEmail');

const COMPANY_NAME = process.env.COMPANY_NAME || "FAB5 Network";

const terminationReminderTemplate = (connection) => ({
  subject: "Reminder: Termination Approaching",
  htmlContent: `
     <p>Dear Sir/Madam,</p>
    <p>Greetings from ${COMPANY_NAME}!!</p>
    <p>
      This is a reminder that the termination date for the 
      <strong>Opportunity ID: ${connection.opportunityId}</strong> is approaching.
    </p>
    <p>
      If you wish to retain or extend this opportunity, please take the necessary 
      action immediately in the CRM to avoid termination of the link.
    </p>
    <p>Kindly ensure this is addressed at the earliest.</p>
    <br/>
    <p>Sincerely,</p>
    <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
  `,
});

const sendTerminationReminder = async (connection) => {
  const { subject, htmlContent } = terminationReminderTemplate(connection);
  const createdByEmail = connection.createdBy?.email;
  const customerEmail = connection.customer?.email;
  if (!createdByEmail || !customerEmail) {
    logger.warn("Sale Person mail or customer email not found", {
      opportunityId: connection.opportunityId,
    });
    return; // Skip sending email
  }

  await sendViaEmailJS(subject, htmlContent, customerEmail, null, createdByEmail);

  logger.info("Termination reminder sent", {
    opportunityId: connection.opportunityId,
    to: customerEmail,
    bcc: createdByEmail,
    finalDate: connection.terminationDetails.finalDate,
  });
};

const startReminderJob = () => {
  // Schedule: Run every day at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    logger.info('⏳ Running Daily Termination Reminder...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const in5Days = new Date(today);
      in5Days.setDate(today.getDate() + 5);

      const connections = await Connection.find({
        status: 'Notice Period',
        "terminationDetails.finalDate": {
          $gte: today,
          $lte: in5Days,
        },
      })
        .populate('createdBy', 'email name')
        .populate('customer', 'email name');

      if (connections.length === 0) {
        logger.info('✅ No reminders needed today.');
        return;
      }

      logger.info(`Found ${connections.length} connection(s) needing reminders`)

      for (const connection of connections) {
        try {
          await sendTerminationReminder(connection);
        } catch (error) {
          logger.error("❌ Failed to send reminder", {
            opportunityId: connection.opportunityId,
            error: err.message,
          });
        }
      }

      logger.info("✅ Termination reminder job completed");

    } catch (error) {
      logger.error("❌ Termination reminder job failed", {
        error: error.message,
        stack: error.stack,
      });
    }
  });
  logger.info("✅ Termination reminder cron scheduled — runs daily at 10:00 AM");
};

module.exports = startReminderJob;  