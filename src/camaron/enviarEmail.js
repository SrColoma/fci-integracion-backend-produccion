'use strict';

// importing AWS sdk
import AWS from 'aws-sdk';
import request from 'request';
// importing config file which contains AWS key
// Best practice: to use a config.copy.json when pushing to github
// Coz exposing the AWS keys to public is not good
// import config from './config.json';

// AWS.config.update({
//   accessKeyId: config.aws.accessKeyId,
//   secretAccessKey: config.aws.secretAccessKey,
//   region: config.aws.region
// });

// Instatiating the SES from AWS SDK
let ses = new AWS.SES();

// Structure of sendMail params structure:

// var params = {
//   Destination: {
//     ToAddresses: [
//       'correo al que le llega el mensaje',
//     ]
//   },
//   Message: {
//     Body: {
//       Text: {
//         Data: 'mensaje',
//       }
//     },
//     Subject: {
//       Data: 'asunto del mensaje',
//     }
//   },
//   Source: 'correo del que sale el mensaje',
// };

//recibe esta estructura
// {
//      "ToAddresses": "correo al que le llega el mensaje",
//      "bodyData": "mensaje",
//      "Subject": "asunto del mensaje",
//      "sourceEmail": "correo del que sale el mensaje"
// }

// The function to send SES email message
module.exports.enviarEmail = (event, context, callback) => {

  let toEmailAddresses = event.body.ToAddresses;
  let bodyData = event.body.bodyData;
  let subjectdata = event.body.Subject;
  let sourceEmail = event.body.sourceEmail;


// The parameters for sending mail using ses.sendEmail()
  // let emailParams = {
  let emailParams = {
    Destination: {
      ToAddresses: [
        toEmailAddresses,
      ]
    },
    Message: {
      Body: {
        Text: {
          Data: bodyData,
        }
      },
      Subject: {
        Data: subjectdata,
      }
    },
    Source: sourceEmail,
  };

// the response to send back after email success.
  const response = {
    statusCode: 200,
    body: {
      message: 'Mail sent successfully'
    },
  };

  ses.sendEmail(emailParams, function(err, data) {
    if (err) callback(null, err); // an error occurred
    else     callback(null, response);         // successful response
  });

// The sendEmail function taking the emailParams and sends the email requests.
  // ses.sendEmail(emailParams, function (err, data) {
  //     if (err) {
  //         callback(err);
  //     } else {

  //       request.post(config.slackWebhook, { body: JSON.stringify(options)}, function (err, httpResponse, body) {
  //         if (err) {
  //           callback(err);
  //         }
  //         callback(null, response);
  //       });

  //     }
  // });
};
