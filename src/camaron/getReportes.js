const AWS = require('aws-sdk');

// recibe una peticion get
// consulta los reportes de la base de datos
module.exports.getReportes = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

    // consulta los reportes de la base de datos
    const reportes = await dynamoDbClient.scan({
        TableName: "CamaronReportesTable",
    }).promise().catch((err) => {
        // envia el error err
        return {
            status: 200,
            body: { message: err },
        }
    })

    // retorna los reportes
    return {
        status: 200,
        body: reportes,
    }
}