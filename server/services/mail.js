import dotenv from 'dotenv';
import sendgrid from '@sendgrid/mail';

dotenv.config();

/**
 * @class Mail
 * @description handles the mails being sent out.
 * @exports Mail
 */
class Mail {
  /**
   * @description generates an account number
   * @static
   * @param {Object} payload
   * @returns {Object} API response
   * @memberof Mail
   */
  static async sendMail(payload) {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const data = {
      to: payload.email,
      from: 'banktoday@banka.com',
      subject: payload.subject,
      html: `Hello <b> ${payload.firstName} ${payload.lastName}</b>
              <br> <br>
              ${payload.message}.
              <br><br> from Banka by Damilola Adekoya`,
    };
    try {
      const sendMail = await sendgrid.send(data);
      if (sendMail) {
        return 'mail sent';
      }
    } catch (err) {
      return 'mail failed to send';
    }
    return true;
  }
}

export default Mail;
