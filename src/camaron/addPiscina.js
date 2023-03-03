const AWS = require('aws-sdk');
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');

//recive una nueva piscina por post
//lo guarda en dynamoDB
//recive esta estructura
//{
//    "nombre": "piscina1",
//    "capacidad": "250",
//}

module.exports.addPiscina = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    const newPiscina = JSON.parse(event.body);
    const piscina = {
        id: uuidv4(),
        fecha: moment.tz('America/Guayaquil').format(),//new Date().toISOString(),
        nombre: newPiscina.nombre,
        capacidad: newPiscina.capacidad,
    }

    //guarda la piscina en la base de datos
    await dynamoDbClient.put({
        TableName: "CamaronPiscinasTable",
        Item: piscina,
    }).promise().catch((err) => {
        return {
            status: 200,
            body: { message: err },
        }
    })

    // retorna la piscina
    return {
        status: 200,
        body: piscina,
    }
}
