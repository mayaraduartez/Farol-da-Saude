const nodemailer = require('nodemailer');


    const  transporter = nodemailer.createTransport({
        service: 'Hotmail',
          auth: {
            user: 'recuperacaodesenhaif@hotmail.com',
            pass: '12340abc'
          }
      });

  module.exports = transporter