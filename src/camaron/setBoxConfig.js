const AWS = require('aws-sdk');


//recive un json con la nueva configuracion de la caja
// crea un nuevo objeto con la nueva configuracion y la fecha de creacion
// guarda el nuevo objeto en la base de datos
// retorna un mensaje de exito
module.exports.setBoxConfig = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    // const nuevaConfiguracion = JSON.parse(event.body);


    const requestBody = event.body;

    const nuevaConfiguracion = JSON.parse(requestBody);

    // actualiza la configuracion de la caja ocn id configuracion
    // si no existe la crea
    const configuracion = await dynamoDbClient.update({
        TableName: "CamaronConfiguracionTable",
        Key: {
            id: "configuracion",
        },
        UpdateExpression: "set configuracion = :configuracion, fecha = :fecha",
        ExpressionAttributeValues: {
            ":configuracion": nuevaConfiguracion,
            ":fecha": new Date().toISOString(),
        },
        ReturnValues: "UPDATED_NEW",
    }).promise().catch((err) => {
        return {
            status: 400,
            body: { message: err },
        }
    })
    
    return {
        status: 200,
        // body: JSON.stringify(configuracion),
        body: configuracion,
    }
    // return {
    //     statusCode: 200,
    //     body: JSON.stringify(nuevaConfiguracion),
    // }
}