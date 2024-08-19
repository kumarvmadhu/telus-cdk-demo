const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient();

exports.handler = async (event) => {
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            recipe_id: { S: uuidv4() },
            recipe_name: { S: data.recipe_name },
            parameter_name: { S: data.parameter_name },
            step_name: { S: data.step_name },
            step_value: { S: data.step_value },
            created_dt: { S: new Date().toISOString() },
            created_by: { S: data.created_by }
        }
    };

    try {
        await client.send(new PutItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Recipe inserted successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not insert recipe' })
        };
    }
};
