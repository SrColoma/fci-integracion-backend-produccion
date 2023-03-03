const AWS = require('aws-sdk');
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');

// recive un nuevo reporte por post
// lo guarda en dynamoDB
// recive esta estructura
// {
//      "inicio": "2021-03-01T00:00:00.000Z",
//      "fin": "2022-03-01T00:00:00.000Z",
//      "piscina": "piscina1"
// }
module.exports.addReporte = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    const newReporte = JSON.parse(event.body);
    const reporte = {
        id: uuidv4(),
        fechaCreacion: moment.tz('America/Guayaquil').format(),//new Date().toISOString(),
        inicio: newReporte.inicio,
        fin: newReporte.fin,
        piscina: newReporte.piscina,
    }

    //guarda el reporte en la base de datos
    await dynamoDbClient.put({
        TableName: "CamaronReportesTable",
        Item: reporte,
    }).promise().catch((err) => {
        return {
            status: 200,
            body: { message: err },
        }
    })

    // retorna el reporte
    return {
        status: 200,
        body: reporte,
    }
}