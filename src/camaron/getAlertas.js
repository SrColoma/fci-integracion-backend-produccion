const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// recibe una peticion get
// consulta las alertas de la base de datos
module.exports.getAlertas = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

    // consulta las alertas de la base de datos
    const alertas = await dynamoDbClient.scan({
        TableName: "CamaronAlertasTable",
    }).promise().catch((err) => {
        // envia el error err
        return {
            status: 200,
            body: { message: err },
        }
    })

    // retorna las alertas
    return {
        status: 200,
        body: alertas,
    }
}