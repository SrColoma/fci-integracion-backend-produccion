const AWS = require('aws-sdk');

//es una peticion get
// consulta todos los valores de los sensores
// trae todos los objetos de la tabla CAMARON_VALORES_TABLE
module.exports.getAllValores = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    // consulta todos los valores de los sensores
    const valores = await dynamoDbClient.scan({
        TableName: "CamaronValoresTable",
    }).promise().catch((err) => {
        return {
            statusCode: 200,
            body: { message: err },
        }
    })

    // trae todos los objetos de la tabla CAMARON_VALORES_TABLE
    return {
        status: 200,
        // body: JSON.stringify(valores),
        body: valores,
    }
}