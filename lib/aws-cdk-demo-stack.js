const { Stack,  RemovalPolicy } = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const path = require('path');
const { LambdaConstruct } = require('./lambda-construct');

class AwsCdkDemoStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'RecipesTable', {
      partitionKey: { name: 'recipe_id', type: dynamodb.AttributeType.STRING },
      tableName: 'Recipes',
      removalPolicy: RemovalPolicy.DESTROY,
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT
      }
    });

    // Add lambdas from LambdaConstruct
    const insertLambda = new LambdaConstruct(this, 'InsertRecipe', {
      functionName: 'InsertRecipe',
      handler: 'insertRecipe.handler',
      table,
      grantReadWrite: true
    });

    const fetchLambda = new LambdaConstruct(this, 'FetchRecipes', {
      functionName: 'FetchRecipes',
      handler: 'fetchRecipes.handler',
      table,
      grantRead: true
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'RecipesApi', {
      restApiName: 'Recipes Service',
      deployOptions: {
        
      }
    });

    const recipes = api.root.addResource('recipes');
    const insertIntegration = new apigateway.LambdaIntegration(insertLambda.lambdaFunction);
    const fetchIntegration = new apigateway.LambdaIntegration(fetchLambda.lambdaFunction);

    recipes.addMethod('POST', insertIntegration);
    recipes.addMethod('GET', fetchIntegration);
  }
}

module.exports = { AwsCdkDemoStack }