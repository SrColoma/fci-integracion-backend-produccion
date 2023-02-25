const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// TODO : falta que puedas eliminar un usuario y tambien que puedas editar un usuario y no repetir usuarios

// recive un nuevo usuario por post
// lo guarda en dynamoDB
// recive esta estructura
// {
//      "user": "admin",
//      "password": "admin",
//      "rol": "admin"
// }

module.exports.addUser = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    const newUser = JSON.parse(event.body);
    const user = {
        id: uuidv4(),
        user: newUser.user,
        password: newUser.password,
        rol: newUser.rol,
    }

    //guarda el usuario en la base de datos
    await dynamoDbClient.put({
        TableName: "CamaronUsersTable",
        Item: user,
    }).promise().catch((err) => {
        return {
            status: 200,
            body: { message: err },
        }
    })

    // retorna el usuario
    return {
        status: 200,
        body: user,
    }
}