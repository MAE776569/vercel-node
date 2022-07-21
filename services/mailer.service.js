const nodemailer = require("nodemailer")
const templateEngine = require("../utils/templateEngine")

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      service: "yahoo",
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      logger: true,
    })
  }

  async createTestAccount() {
    const testAccount = await nodemailer.createTestAccount()
    return testAccount
  }

  createTestTransporter({ user, pass }) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user, // generated ethereal user
        pass, // generated ethereal password
      },
    })

    return transporter
  }

  getEmailSender({ name, email }) {
    return `"${name}" <${email}>`
  }

  getEmailReceivers(emails) {
    return emails.join(", ")
  }

  async sendTestEmail({ to, templatePath, subject, data }) {
    const testAccount = await this.createTestAccount()
    const transporter = this.createTestTransporter(testAccount)
    const template = await templateEngine.compile({
      templatePath,
      data,
    })

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: this.getEmailSender({
        name: "Kidzinia",
        email: "test@kidzinia.com",
      }),
      to: this.getEmailReceivers([to]),
      subject,
      // text: "Hello from kidzinia",
      html: template, // html body
    })

    info.testMessageUrl = nodemailer.getTestMessageUrl(info)
    return info
  }

  async sendEmail({ to, templatePath, subject, data }) {
    const template = await templateEngine.compile({
      templatePath,
      data,
    })
    const info = await this.transporter.sendMail({
      from: this.getEmailSender({
        name: "Kidzinia",
        email: process.env.EMAIL_USER,
      }),
      to: this.getEmailReceivers([to]),
      subject,
      html: template,
    })
    return info
  }
}

module.exports = new Mailer()
