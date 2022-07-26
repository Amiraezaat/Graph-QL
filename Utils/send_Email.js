var nodeoutlook = require('nodejs-nodemailer-outlook')

// ========= this function responsible for send a message for specific email ======
function send_Email (dest, message, subject, attachment) {
  console.log("ssssssssssssssssssssssssssssssssssssssssssssss");
  if (!attachment) {
    attachment = []
  }
  console.log(process.env.SENDER_EMAIL)
  nodeoutlook.sendEmail({ 
    auth: {
      user:process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS
    },
    from:process.env.SENDER_EMAIL,
    to: dest,
    subject: subject,
    html: message, 
    attachments: attachment,
    onError: e => console.log({ nodemaileFail : e}),
    onSuccess: i => console.log({nodemailerSuccess : i})
  })
}

module.exports = { send_Email }