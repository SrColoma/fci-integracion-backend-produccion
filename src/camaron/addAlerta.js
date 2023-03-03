const AWS = require('aws-sdk');
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');

// recive un nuevo alerta por post
// lo guarda en dynamoDB
// recive esta estructura
// {
//      "tipo": "TEMP",
//      "valor": "30",
//      "mensaje": "max"
// }

module.exports.addAlerta = async (event) => {
    const ses = new AWS.SES();
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    const newAlerta = JSON.parse(event.body);
    
    const alerta = {
        id: uuidv4(),
        fecha: moment.tz('America/Guayaquil').format(),//new Date().toISOString(),
        tipo: newAlerta.tipo,
        valor: newAlerta.valor,
        mensaje: newAlerta.mensaje,
    }


    let toEmailAddresses=[];
    let subjectdata = "Alerta de Camaron";
    let sourceEmail = "elianamoreira204@hotmail.com";
    let bodyData = "Alerta de Camaron: " + alerta.tipo + " " + alerta.valor + " " + alerta.mensaje;

    // consulta la tabla de usuarios
    // guarda los emails de los usuarios en toEmailAddresses
    await dynamoDbClient.scan({
        TableName: "CamaronUsersTable",
    }).promise().then((data) => {
        data.Items.forEach((item) => {
            toEmailAddresses.push(item.email);
        })
    }).catch((err) => {
        return {
            status: 200,
            body: { message: err },
        }
    })

    const emailParams = {
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

    //guarda el alerta en la base de datos
    await dynamoDbClient.put({
        TableName: "CamaronAlertasTable",
        Item: alerta,
    }).promise().catch((err) => {
        return {
            status: 200,
            body: { message: err },
        }
    })

    const response = {
        statusCode: 200,
        body: alerta
      };

    ses.sendEmail(emailParams, function(err, data) {
        if (err) callback(null, err); // an error occurred
        else     callback(null, response);         // successful response
    });

    // retorna el alerta
    return response
}