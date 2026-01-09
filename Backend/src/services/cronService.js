const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Customer = require('../models/customerModel'); 

// 1. Setup Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const startReminderJob = () => {
  // Schedule: Run every day at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    console.log('⏳ Running Daily 3-Day Disconnection Reminder...');

    try {
      const today = new Date();
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + 3);

      const startOfDay = new Date(targetDate.setHours(0,0,0,0));
      const endOfDay = new Date(targetDate.setHours(23,59,59,999));

      const dueCustomers = await Customer.find({
        status: 'Pending Disconnection',
        currentDisconnectDate: { $gte: startOfDay, $lte: endOfDay }
      }).populate('managedBy'); 

      if (dueCustomers.length === 0) {
        console.log('✅ No reminders needed today.');
        return;
      }

      for (const customer of dueCustomers) {
        
        const managerEmail = customer.managedBy ? customer.managedBy.email : process.env.OWNER_EMAIL;

        const mailOptions = {
          from: `"FAB5 CRM System" <${process.env.EMAIL_USER}>`,
          to: [managerEmail],
          subject: "Reminder Notification",
          html: `
            <p>Dear Sir/Madam,</p>
            <p>Greetings from FAB5 Network !!</p>
            <p>Basis your request, there are only a few days remaining for your Disconnection Service Request <strong>${customer.circuitId}</strong></p>
            <p>However, we are eager to continue our services for this connection and would like to hear your inputs on <a href="mailto:crm@fab5network.com">crm@fab5network.com</a></p>
            <br/>
            <p>Sincerely,</p>
            <p><strong>Customer Relationship Manager</strong><br/>FAB5 Network</p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📩 Reminder sent to ${managerEmail} for Circuit ID: ${customer.circuitId}`);
      }

    } catch (error) {
      console.error('Scheduler Error:', error);
    }
  });
};

module.exports = startReminderJob;