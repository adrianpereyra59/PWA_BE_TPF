import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

let transporterPromise = (async () => {
  if (ENVIRONMENT.GMAIL_USERNAME && ENVIRONMENT.GMAIL_PASSWORD) {
    console.log('Using Gmail transporter for emails')
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ENVIRONMENT.GMAIL_USERNAME,
        pass: ENVIRONMENT.GMAIL_PASSWORD
      },
      tls: { rejectUnauthorized: false }
    })
  } else {
    console.log('No Gmail credentials found — creating Ethereal test account for emails')
    const testAccount = await nodemailer.createTestAccount()
    console.info('Ethereal test account (dev):', { user: testAccount.user })
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    })
  }
})()

export async function sendMail(opts) {
  const transporter = await transporterPromise
  const info = await transporter.sendMail(opts)
  const preview = nodemailer.getTestMessageUrl(info) || null
  return { info, preview }
}

export default { sendMail }