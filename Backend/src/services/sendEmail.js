const emailjs = require("@emailjs/nodejs");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const EMAIL_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID,
  templateId: process.env.EMAILJS_TEMPLATE_ID,
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
};

const COMPANY_NAME = process.env.COMPANY_NAME || "FAB5 Network";
const CRM_EMAIL = process.env.CRM_EMAIL;
const BILLING_EMAIL = process.env.BILLING_EMAIL;
const PROJECT_EMAIL = process.env.PROJECT_EMAIL;
const PERSON_EMAIL = process.env.PERSON_EMAIL;

const missingKeys = Object.entries(EMAIL_CONFIG)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  throw new Error(
    `EmailJS config missing: ${missingKeys.join(", ")} are required`
  );
}

const buildCC = (...emails) => emails.filter(Boolean);

// ─── Base Sender ──────────────────────────────────────────────────────────────

/*
 * @param {string}        subject
 * @param {string}        htmlContent
 * @param {string|Array}  to
 * @param {string|Array}  [cc]
 * @param {string|Array}  [bcc]
 */
const sendViaEmailJS = async (subject, htmlContent, to, cc, bcc) => {
  const missing = [];
  if (!subject) missing.push("subject");
  if (!htmlContent) missing.push("htmlContent");
  if (!to) missing.push("to");

  if (missing.length > 0) {
    throw new AppError(`sendViaEmailJS missing required fields: ${missing.join(", ")}`, 400);
  }

  const normalizeEmail = (val) => {
    if (!val) return undefined;
    return Array.isArray(val) ? val.join(",") : val;
  };

  const templateParams = {
    subject,
    html_content: htmlContent,
    to_email: normalizeEmail(to),
    cc_email: normalizeEmail(cc),
    bcc_email: normalizeEmail(bcc),
    current_year: new Date().getFullYear(),
  };

  logger.info("Sending email via EmailJS", {
    to: templateParams.to_email,
    subject,
  });

  await emailjs.send(
    EMAIL_CONFIG.serviceId,
    EMAIL_CONFIG.templateId,
    templateParams,
    {
      publicKey: EMAIL_CONFIG.publicKey,
      privateKey: EMAIL_CONFIG.privateKey,
    }
  );
};

// ─── Email Templates ──────────────────────────────────────────────────────────

const EMAIL_TEMPLATES = {
  // ── Connection Lifecycle ──────────────────────────────────────────────────

  WELCOME: (connection) => ({
    subject: "Welcome & Opportunity Created",
    htmlContent: `
      <p>Dear Sir/Madam,</p>
      <p>Greetings from ${COMPANY_NAME}!!</p>
      <p>
        Thank you for submitting your order details. We're pleased to inform you that 
        your order has been successfully registered in our system.
      </p>
      <p>Your Opportunity ID is: <strong>${connection.opportunityId}</strong></p>
      <p>
        Commercial team will review your order and get in touch with you shortly.
      </p>
      <br/>
      <p>Sincerely,</p>
      <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
    `,
  }),

  ORDER_APPROVED: (connection) => ({
    subject: "Order Approved by Commercial Team",
    htmlContent: `
      <p>Dear Sir/Madam,</p>
      <p>Greetings from ${COMPANY_NAME}!!</p>
      <p>
        We are pleased to inform you that the order with 
        <strong>Opportunity ID: ${connection.opportunityId}</strong> has been approved 
        by the Commercial Team.
      </p>
      <p>
        We now proceed with the next steps for execution and fulfillment of the order.
      </p>
      <br/>
      <p>Sincerely,</p>
      <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
    `,
  }),

  ORDER_REJECTED: (connection) => ({
    subject: "Order Rejected by Commercial Team",
    htmlContent: `
      <p>Dear Sir/Madam,</p>
      <p>Greetings from ${COMPANY_NAME}!!</p>
      <p>
        This is to inform you that the order with 
        <strong>Opportunity ID: ${connection.opportunityId}</strong> has been reviewed 
        and rejected by the Commercial Team.
      </p>
      <p>
        We request you to review the details and take necessary action accordingly. 
        Please connect with the Commercial Team if further clarification is required.
      </p>
      <br/>
      <p>Sincerely,</p>
      <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
    `,
  }),

  ORDER_GENERATED: (connection) => ({
    subject: "Order Placed with Upstream – Under Implementation",
    htmlContent: `
      <p>Dear Sir/Madam,</p>
      <p>Greetings from ${COMPANY_NAME}!!</p>
      <p>
        This is to inform you that the order with 
        <strong>Opportunity ID: ${connection.opportunityId}</strong> has been successfully 
        placed with the upstream and is now under implementation.
      </p>
      <p>
        We request you to kindly coordinate with the Project Manager for further updates, 
        support, and any assistance required during the implementation phase.
      </p>
      <br/>
      <p>Sincerely,</p>
      <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
    `,
  }),

  ACTIVATED: (connection) => ({
    subject: "Order Successfully Delivered – Congrats!!",
    htmlContent: `
    <p>Dear Sir/Madam,</p>
    <p>Greetings from ${COMPANY_NAME}!!</p>
    <p>
      We are pleased to inform you that the order with 
      <strong>Opportunity ID: ${connection.opportunityId}</strong> has been successfully 
      delivered and updated to the billing team.
    </p>
    <br/>
    <p>Sincerely,</p>
    <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
  `,
  }),

  CANCELLED: (connection) => ({
    subject: "Order Cancelled – Oops!!",
    htmlContent: `
    <p>Dear Sir/Madam,</p>
    <p>Greetings from ${COMPANY_NAME}!!</p>
    <p>
      We regret to inform you that the order with 
      <strong>Opportunity ID: ${connection.opportunityId}</strong> has been cancelled 
      due to the following reason:
    </p>
    <p><strong>Reason:</strong> ${connection.reason}</p>
    <p>
      Please coordinate with the Project team if any further clarification 
      or next steps are required.
    </p>
    <br/>
    <p>Sincerely,</p>
    <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
  `,
  }),

  // ────────────────── Upgrade / Downgrade ───────────────────
  UPGRADE: (connection) => ({
    subject: "Bandwidth Change Request Submitted",
    htmlContent: `
    <p>Dear Sir/Madam,</p>
    <p>Greetings from ${COMPANY_NAME}!!</p>
    <p>
      Thank you for submitting your bandwidth change request for 
      <strong>Opportunity ID: ${connection.opportunityId}</strong>. 
      We're pleased to inform you that your request has been successfully registered.
    </p>
    <br/>
    <table style="border-collapse: collapse;">
      <tr>
        <td style="padding-right: 40px;">
          <strong>Old Bandwidth:</strong> ${connection.oldBandwidth}
        </td>
        <td>
          <strong>New Bandwidth:</strong> ${connection.newBandwidth}
        </td>
      </tr>
    </table>
    <br/>
    <p>
      Our Commercial team will review the request and get back to you 
      shortly with the next steps.
    </p>
    <br/>
    <p>Sincerely,</p>
    <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
  `,
  }),

  DOWNGRADE: (connection) => ({
    subject: "Bandwidth Change Request Submitted",
    htmlContent: `
    <p>Dear Sir/Madam,</p>
    <p>Greetings from ${COMPANY_NAME}!!</p>
    <p>
      Thank you for submitting your bandwidth change request for 
      <strong>Opportunity ID: ${connection.opportunityId}</strong>. 
      We're pleased to inform you that your request has been successfully registered.
    </p>
    <br/>
    <table style="border-collapse: collapse;">
      <tr>
        <td style="padding-right: 40px;">
          <strong>Old Bandwidth:</strong> ${connection.oldBandwidth}
        </td>
        <td>
          <strong>New Bandwidth:</strong> ${connection.newBandwidth}
        </td>
      </tr>
    </table>
    <br/>
    <p>
      Our Commercial team will review the request and get back to you 
      shortly with the next steps.
    </p>
    <br/>
    <p>Sincerely,</p>
    <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
  `,
  }),

  // ────────────────────── Shifting ──────────────────────────────
  SHIFTING: (connection) => ({
    subject: "Shifting Request Submitted",
    htmlContent: `
    <p>Dear Sir/Madam,</p>
    <p>Greetings from ${COMPANY_NAME}!!</p>
    <p>
      Thank you for submitting your shifting request for 
      <strong>Opportunity ID: ${connection.opportunityId}</strong>. 
      We're pleased to inform you that your request has been successfully registered.
    </p>
    <br/>
    <table style="border-collapse: collapse;">
      <tr>
        <td style="padding-right: 40px;">
          <strong>Current A End:</strong> ${connection.currentAEnd}
        </td>
        <td>
          <strong>New A End:</strong> ${connection.newAEnd}
        </td>
      </tr>
      <tr>
        <td style="padding-right: 40px; padding-top: 8px;">
          <strong>Current B End:</strong> ${connection.currentBEnd}
        </td>
        <td style="padding-top: 8px;">
          <strong>New B End:</strong> ${connection.newBEnd}
        </td>
      </tr>
    </table>
    <br/>
    <p>
      Our Commercial team will review the request and get back to you 
      shortly with the next steps.
    </p>
    <br/>
    <p>Sincerely,</p>
    <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
  `,
  }),

  // ── Disconnection Lifecycle ───────────────────────────────────────────────
  DISCONNECTION: (connection) => ({
    subject: "Disconnection Notification",
    htmlContent: `
      <p>Dear Sir/Madam,</p>
      <p>Greetings from ${COMPANY_NAME}!!</p>
      <p>
        This is to acknowledge that we have received your Disconnection Request for the
        <strong>Opportunity ID: ${connection.opportunityId}</strong> submitted through the CRM.
        If you wish to cancel or extend your disconnection request, kindly do so at least
        five days before the disconnection date.
      </p>
      <br/>
      <p>Sincerely,</p>
      <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
    `,
  }),

  RETENTION: (connection) => ({
    subject: "Service Continuation Notification",
    htmlContent: `
      <p>Dear Sir/Madam,</p>
      <p>Greetings from ${COMPANY_NAME}!!</p>
      <p>
        In accordance with your request to cancel the Disconnection of
        <strong>Opportunity ID: ${connection.opportunityId}</strong>, we are pleased to inform you
        that the link will remain operational and billing will proceed as usual.
      </p>
      <p>We value your association with us and look forward to serving you.</p>
      <br/>
      <p>Sincerely,</p>
      <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
    `,
  }),

  EXTENSION: (connection) => ({
    subject: "Disconnection Extension Notification",
    htmlContent: `
      <p>Dear Sir/Madam,</p>
      <p>Greetings from ${COMPANY_NAME}!!</p>
      <p>
        This is to acknowledge that we have received a service extension of the disconnection
        request for the <strong>Opportunity ID: ${connection.opportunityId}</strong>, submitted
        through the CRM. If you wish to cancel or further extend your disconnection request,
        kindly do so at least five days before the final disconnection date.
      </p>
      <br/>
      <p>Earlier disconnection date: <strong>${connection.previousDisconnectionDate}</strong></p>
      <p>Current disconnection date: <strong>${connection.disconnectionDate}</strong></p>
      <br/>
      <p>Sincerely,</p>
      <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
    `,
  }),

  // ── Auth ──────────────────────────────────────────────────────────────────

  OTP: (otp) => ({
    subject: "Your Verification Code (OTP)",
    htmlContent: `
      <h2>Verification Code</h2>
      <div style="
        margin: 20px 0;
        padding: 15px;
        background-color: #f8f9fa;
        border-left: 5px solid #007bff;
      ">
        <span style="
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 5px;
          color: #333;
        ">
          ${otp}
        </span>
      </div>
      <p>This code expires in 10 minutes. Do not share it with anyone.</p>
      <p style="color: #666; font-size: 12px;">
        If you did not request this code, please contact admin.
      </p>
    `,
  }),
};

// ─── Valid Type Maps ──────────────────────────────────────────────────────────

const CONNECTION_TYPES = ["WELCOME", "ORDER_APPROVED", "ORDER_REJECTED", "ORDER_GENERATED", "ACTIVATED", "CANCELLED"];
const DISCONNECTION_TYPES = ["DISCONNECTION", "RETENTION", "EXTENSION"];
const CHANGE_TYPES = ["UPGRADE", "DOWNGRADE", "SHIFTING"];

// ─── Public Functions ─────────────────────────────────────────────────────────
const sendOTPEmail = async (email, otp) => {
  if (!email || !otp) {
    throw new AppError("email and otp are required", 400);
  }

  const { subject, htmlContent } = EMAIL_TEMPLATES.OTP(otp);

  try {
    await sendViaEmailJS(subject, htmlContent, email);
    logger.info("✅ OTP email sent", { to: email });
    return true;
  } catch (error) {
    logger.error("❌ Failed to send OTP email", {
      to: email,
      error: error.message,
    });
    return false;
  }
};

const sendChangeEmail = async (type, connection, employee) => {
  if (!CHANGE_TYPES.includes(type)) {
    throw new AppError(`Invalid change email type: ${type}. Must be one of: ${CHANGE_TYPES.join(", ")}`, 400);
  }

  if (!employee?.email) throw new AppError("Employee email is required", 400);
  if (!connection?.opportunityId) throw new AppError("Connection opportunityId is required", 400);

  if (type === "UPGRADE" || type === "DOWNGRADE") {
    if (!connection.oldBandwidth || !connection.newBandwidth) {
      throw new AppError(`${type} requires oldBandwidth and newBandwidth`, 400);
    }
  }

  if (type === "SHIFTING") {
    const missing = ["currentAEnd", "newAEnd", "currentBEnd", "newBEnd"]
      .filter((key) => !connection[key]);
    if (missing.length > 0) {
      throw new AppError(`SHIFTING requires: ${missing.join(", ")}`, 400);
    }
  }

  const { subject, htmlContent } = EMAIL_TEMPLATES[type](connection);

  const createdByEmail = connection.createdBy?.email || null;

  const to  = createdByEmail || CRM_EMAIL;
  const bcc = buildCC(CRM_EMAIL);

  try {
    await sendViaEmailJS(subject, htmlContent, to, null, bcc);
    logger.info(`✅ ${type} email sent`, { type, to, bcc });
  } catch (error) {
    logger.error(`❌ Failed to send ${type} email`, {
      type,
      to,
      error: error.message,
    });
    throw new AppError(`Failed to send ${type} email`, 500);
  }
};

const sendConnectionEmail = async (type, connection, employee) => {
  if (!CONNECTION_TYPES.includes(type)) {
    throw new AppError(`Invalid connection email type: ${type}. Must be one of: ${CONNECTION_TYPES.join(", ")}`,400);
  }

  if (!employee?.email) throw new AppError("Employee email is required", 400);
  if (!connection?.opportunityId) throw new AppError("Connection opportunityId is required", 400);

  const { subject, htmlContent } = EMAIL_TEMPLATES[type](connection);

  const createdByEmail = connection.createdBy?.email || null;

  const toMap = {
    WELCOME: createdByEmail || CRM_EMAIL,
    ORDER_APPROVED: createdByEmail || CRM_EMAIL,
    ORDER_REJECTED: createdByEmail || CRM_EMAIL,
    ORDER_GENERATED: createdByEmail || CRM_EMAIL,
    ACTIVATED: createdByEmail || CRM_EMAIL,
    CANCELLED: createdByEmail || CRM_EMAIL,
  };

  const bccMap = {
    WELCOME: buildCC(CRM_EMAIL),
    ORDER_APPROVED: buildCC(CRM_EMAIL),
    ORDER_REJECTED: buildCC(CRM_EMAIL),
    ORDER_GENERATED: buildCC(CRM_EMAIL, PROJECT_EMAIL),
    ACTIVATED: buildCC(CRM_EMAIL, BILLING_EMAIL, PERSON_EMAIL),
    CANCELLED: buildCC(CRM_EMAIL, PERSON_EMAIL),
  };

  const to = toMap[type] || createdByEmail;
  const bcc = bccMap[type] || buildCC(CRM_EMAIL);

  try {
    await sendViaEmailJS(subject, htmlContent, to, null, bcc);
    logger.info(`✅ ${type} email sent`, { type, to, bcc });
  } catch (error) {
    logger.error(`❌ Failed to send ${type} email`, {
      type,
      to,
      error: error.message,
    });
    throw new AppError(`Failed to send ${type} email`, 500);
  }
};

const sendTransactionEmail = async (type, connection, employee) => {
  if (!DISCONNECTION_TYPES.includes(type)) {
    throw new AppError(`Invalid transaction email type: ${type}. Must be one of: ${DISCONNECTION_TYPES.join(", ")}`, 400);
  }

  if (!employee?.email) throw new AppError("Employee email is required", 400);
  if (!connection?.opportunityId) throw new AppError("Connection opportunityId is required", 400);

  if (type === "EXTENSION") {
    if (!connection.previousDisconnectionDate || !connection.disconnectionDate) {
      throw new AppError("EXTENSION type requires previousDisconnectionDate and disconnectionDate", 400);
    }
  }

  const { subject, htmlContent } = EMAIL_TEMPLATES[type](connection);

  const createdByEmail = connection.createdBy?.email || null;
  const to  = createdByEmail || CRM_EMAIL;
  const bcc = buildCC(CRM_EMAIL);

  try {
    await sendViaEmailJS(subject, htmlContent, to, null, bcc);
    logger.info(`✅ ${type} email sent`, { type, to, bcc });
  } catch (error) {
    logger.error(`❌ Failed to send ${type} email`, {
      type,
      to,
      error: error.message,
    });
    throw new AppError(`Failed to send ${type} email`, 500);
  }
};

module.exports = {
  sendOTPEmail,
  sendConnectionEmail,
  sendTransactionEmail,
  sendChangeEmail
};
