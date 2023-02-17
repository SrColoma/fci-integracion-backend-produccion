const AWS = require('aws-sdk');

//es una peticion post
// recive  un json con la fecha de inicio y la fecha final
// consulta los valores de los sensores en el rango de fechas
// retorna los valores de los sensores en el rango de fechas
module.exports.getValores = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    const { fechaInicio, fechaFinal } = JSON.parse(event.body);
    console.log(fechaInicio, fechaFinal);

    // consulta los valores de los sensores en el rango de fechas
    const valores = await dynamoDbClient.query({
        TableName: "CamaronValoresTable",
        // IndexName: 'fecha-hora-index',
        KeyConditionExpression: "#fecha BETWEEN :fechaInicio AND :fechaFinal",
        ExpressionAttributeNames: {
            "#fecha": "fecha",
        },
        ExpressionAttributeValues: {
            ":fechaInicio": fechaInicio,
            ":fechaFinal": fechaFinal,
        },
    }).promise().catch((err) => {
        return {
            status: 200,
            body: { message: err },
        }
    })

    // retorna los valores de los sensores en el rango de fechas
    return {
        status: 200,
        // body: JSON.stringify(valores),
        body: valores,
    }

}