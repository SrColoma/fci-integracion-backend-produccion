const AWS = require('aws-sdk');

//es una consulta get
// consulta todos los valores de la tabla CamaronPiscinasTable
module.exports.getPiscinas = async (event) =>{
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    // consulta todos los valores de la tabla CamaronPiscinasTable
    const piscinas = await dynamoDbClient.scan({
        TableName: "CamaronPiscinasTable",
    }).promise().catch((err) => {
        return {
            statusCode: 200,
            body: { message: err },
        }
    })

    // trae todos los objetos de la tabla CamaronPiscinasTable
    return {
        status: 200,
        // body: JSON.stringify(valores),
        body: piscinas,
    }
}