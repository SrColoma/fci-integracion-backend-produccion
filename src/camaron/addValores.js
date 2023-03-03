
const AWS = require('aws-sdk');
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');
// recive los valores de los sensores por post
// los guarda en dynamoDB 
// consulta la configuracion de la caja
// la configuracion de la caja
// recive esta estructura
// {
//     "OXDIX" : "6",
//     "TEMP": "4",
//     "SAL" : "4",
//     "PH": "3",
//     "TURBIDEZ": "2",
//     "TDS": "6",
//     "LLUVIA": "0",
//     "NIVEL": "1"
// }
module.exports.addValores = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    const nuevosValores = JSON.parse(event.body);
    //convierte los valores a numeros
    for (const key in nuevosValores) {
        nuevosValores[key] = Number(nuevosValores[key]);
    }
    const valores = {
        id: uuidv4(),
        fecha: new moment.tz('America/Guayaquil').format(),//Date().toISOString(),
        valores: nuevosValores,
    }

    //guarda los valores en la base de datos
    await dynamoDbClient.put({
        TableName: "CamaronValoresTable",
        Item: valores,
    }).promise().catch((err) => {
        return {
            status: 200,
            body: { message: err },
        }
    })
    

    // consulta la configuracion de la caja
    const configuracion = await dynamoDbClient.get({
        TableName: process.env.CAMARON_CONFIGURACION_TABLE,
        Key: {
            id: "configuracion",
        }
    }).promise().catch((err) => {
        // envia el error err
        return {
            status: 200,
            body: { message: err },
        }
    })

    // retorna la configuracion de la caja
    return {
        status: 200,
        // body: JSON.stringify({"configuracion":configuracion.Item,"valores":valores}),
        body: {"configuracion":configuracion.Item,"valores":valores},
    }
}
