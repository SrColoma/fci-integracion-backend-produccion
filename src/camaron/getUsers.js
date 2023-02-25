const AWS = require('aws-sdk');

// recibe una peticion get
// consulta los usuarios de la base de datos\
module.exports.getUsers = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

    // consulta los usuarios de la base de datos
    const users = await dynamoDbClient.scan({
        TableName: "CamaronUsersTable",
    }).promise().catch((err) => {
        // envia el error err
        return {
            status: 200,
            body: { message: err },
        }
    })

    // retorna los usuarios
    return {
        status: 200,
        body: users,
    }
}