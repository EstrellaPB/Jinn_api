'use strict'

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: "586cf511671d8b",
        pass: "5814b842b02f5d"
    }
})

function getPasswordResetURL(user, token) {
    return `http://localhost:3333/password-reset/${user._id}/${token}`;
}

function getApproveReservationUrl(reservation) {
    return `http://localhost:3333/property/approve-reservation/${reservation._id}`;
}

function resetPasswordTemplate(user, url) {
    const from = 'Jinn@gmail.com'
    const to = user.email
    const subject = "🌻 Jinn Password Reset 🌻"
    const html = //html 
        `
    <p>Hey ${user.name || user.email},</p>
    <p>We heard that you lost your Jinn password. Sorry about that!</p>
    <p>But don’t worry! You can use the following link to reset your password:</p>
    <a href=${url}>${url}</a>
    <p>If you don’t use this link within 1 hour, it will expire.</p>
    <p>Do something outside today! </p>
    <p>–Your friends at Jinn</p>
    `

    return { from, to, subject, html }
}

function reservationBookTemplate(user, reservationPayload, approveReservationUrl) {
    const from = user.email
    const to = 'irv.agui@gmail.com'
    const subject = "Jinn Reservation"
    const html = //html
    `
    <p>Hey administrator,</p>
    <p>The user is requesting to book a date for ${reservationPayload.property.title}.</p>
    <p>From: ${reservationPayload.dateBegin}</p>
    <p>To: ${reservationPayload.dateEnd}</p>
    <p>Use the following link to approve the reservation:</p>
    <a href=${approveReservationUrl}>${approveReservationUrl}</a>
    `

    return { from, to, subject, html }
}

module.exports = {
    transporter,
    getPasswordResetURL,
    getApproveReservationUrl,
    resetPasswordTemplate,
    reservationBookTemplate
}