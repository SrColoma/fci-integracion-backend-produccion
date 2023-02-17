const AWS = require('aws-sdk');

// es una consulta get
// consulta la ultima configuracion de la caja
// retorna la configuracion de la caja
module.exports.getBoxConfig = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();


    const configuracion = await dynamoDbClient.get({
        TableName: "CamaronConfiguracionTable",
        Key: {
            id: "configuracion",
        }
    }).promise().catch((err) => {
        return {
            statusCode: 200,
            body: { message: err },
        }
    })


    // retorna la configuracion de la caja
    return {
        status: 200,
        // body: JSON.stringify(configuracion.Item.configuracion),
        body: configuracion.Item.configuracion,
    }
}