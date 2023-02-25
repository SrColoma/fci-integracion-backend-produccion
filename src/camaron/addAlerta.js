const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// recive un nuevo alerta por post
// lo guarda en dynamoDB
// recive esta estructura
// {
//      "tipo": "TEMP",
//      "valor": "30",
//      "mensaje": "max"
// }

module.exports.addAlerta = async (event) => {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
    const newAlerta = JSON.parse(event.body);
    const alerta = {
        id: uuidv4(),
        fecha: new Date().toISOString(),
        tipo: newAlerta.tipo,
        valor: newAlerta.valor,
        mensaje: newAlerta.mensaje,
    }

    //guarda el alerta en la base de datos
    await dynamoDbClient.put({
        TableName: "CamaronAlertasTable",
        Item: alerta,
    }).promise().catch((err) => {
        return {
            status: 200,
            body: { message: err },
        }
    })

    // retorna el alerta
    return {
        status: 200,
        body: alerta,
    }
}