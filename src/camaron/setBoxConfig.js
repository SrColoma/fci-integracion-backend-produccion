const AWS = require('aws-sdk');
const moment = require('moment-timezone');


//recive un json con la nueva configuracion de la caja
// crea un nuevo objeto con la nueva configuracion y la fecha de creacion
// guarda el nuevo objeto en la base de datos
// retorna un mensaje de exito
// recive esta estructura
// {
//     "frecuencia": 2,
//     "piscina": "piscina1",
//     "min_OXDIX" : 1,
//     "max_OXDIX" : 2,
//     "min_TEMP": 4,
//     "max_TEMP": 9,
//     "min_SAL" : 1,
//     "max_SAL" : 3,
//     "min_PH": 2,
//     "max_PH": 4,
//     "min_TURBIDEZ": 1,
//     "max_TURBIDEZ": 2,
//     "min_TDS": 3,
//     "max_TDS": 9,
//     "min_LLUVIA": 0,
//     "max_LLUVIA": 1,
//     "min_NIVEL": 0,
//     "max_NIVEL": 2
//   }
module.exports.setBoxConfig = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    // const nuevaConfiguracion = JSON.parse(event.body);


    const requestBody = event.body;

    const nuevaConfiguracion = JSON.parse(requestBody);

    // actualiza la configuracion de la caja ocn id configuracion
    // si no existe la crea
    const configuracion = await dynamoDbClient.update({
        TableName: "CamaronConfiguracionTable",
        Key: {
            id: "configuracion",
        },
        UpdateExpression: "set configuracion = :configuracion, fecha = :fecha",
        ExpressionAttributeValues: {
            ":configuracion": nuevaConfiguracion,
            ":fecha": moment.tz('America/Guayaquil').format(),//new Date().toISOString(),
        },
        ReturnValues: "UPDATED_NEW",
    }).promise().catch((err) => {
        return {
            status: 400,
            body: { message: err },
        }
    })
    
    return {
        status: 200,
        // body: JSON.stringify(configuracion),
        body: configuracion,
    }
    // return {
    //     statusCode: 200,
    //     body: JSON.stringify(nuevaConfiguracion),
    // }
}