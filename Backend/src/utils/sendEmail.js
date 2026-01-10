const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 465,             
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTransactionEmail = async (type, customer, employee) => {
  try {
    let subject = "";
    let htmlContent = "";

    if (type === "DISCONNECTION") {
      subject = `Disconnection Notification`;
      htmlContent = `
        <p>Dear Sir/Madam,</p>
        <p>Greetings from FAB5 Network !!</p>
        <br/>
        <br/>
        <p>This is to acknowledge that we have received your Disconnection Service Request ${customer.circuitId} submitted through our CRM If you wish to cancel or extend your disconnection request,kindly do that at least five days before the disconnection date.</p>
        <p>For any queries or further assistance, please feel free to write to us on crm@fab5network.com</p>
        <br/>
        <br/>
        <p>Sincerely</p>
        <p>Customer Relationship Manager</p>
        <p>FAB5 Network</p>
      `;
    } else if (type === "RETENTION") {
      subject = `Service Continuation Notification`;
      htmlContent = `
        <p>Dear Sir/Madam,</p>
        <p>Greetings from FAB5 Network !!</p>
        <br/>
        <br/>
        <p>In accordance with your request to cancel the Disconnection Service Request ${customer.circuitId} raised earlier, we're pleased to inform you that the link will remain operational and the billing will proceed as usual.</p>
        <p>For any queries or further assistance, please feel free to write to us on crm@fab5network.com</p>
        <br/>
        <p>We value your association with us and are looking forward to serving you in the future.</p>
        <br/>
        <br/>
        <p>Sincerely</p>
        <p>Customer Relationship Manager</p>
        <p>FAB5 Network</p>
      `;
    }

    await transporter.sendMail({
      from: `"FAB5 Connect" <${process.env.EMAIL_USER}>`,
      to: employee.email,
      cc:process.env.OWNER_EMAIL,
      subject: subject,
      html: htmlContent,
    });

    console.log(`✅ ${type} email sent for ${customer.circuitId}`);
  } catch (error) {
    console.error("Email Service Error:", error);
  }
};
const sendEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"FAB5 Connect" <no-reply@FAB5.com>`,
      to: email,
      subject: "Your Verification Code (OTP)",
      html: `
          <h2>Verification code</h2>
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 5px solid #007bff;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">
              ${otp}
            </span>
          </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;

  } catch (error) {
    console.error("Error sending OTP:", error);
    return false; 
  }
};

module.exports = { sendEmail, sendTransactionEmail };
