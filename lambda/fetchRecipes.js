const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const dynamoDbClient = new DynamoDBClient();

exports.handler = async (event) => {
    const params = {
        TableName: process.env.TABLE_NAME
    };

    try {
        let data = await dynamoDbClient.send(new ScanCommand(params));
        data.Items = data.Items.map(item => {
            return {
                recipe_id: item.recipe_id.S,
                recipe_name: item.recipe_name.S,
                parameter_name: item.parameter_name.S,
                step_name: item.step_name.S,
                step_value: item.step_value.S,
                created_dt: item.created_dt.S,
                created_by: item.created_by.S
            };
        });
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch recipes' })
        };
    }
};

