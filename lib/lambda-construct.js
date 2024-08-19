const {  Duration, aws_logs } = require('aws-cdk-lib');
const { Construct } = require('constructs');
const lambda = require('aws-cdk-lib/aws-lambda');
const iam = require('aws-cdk-lib/aws-iam');
const path = require('path');

class LambdaConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    // Define the Lambda function
    this.lambdaFunction = new lambda.Function(this, props.functionName, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: props.handler,
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),      
      environment: {
        TABLE_NAME: props.table.tableName,
      },
      logRetention: aws_logs.RetentionDays.ONE_DAY,
      memorySize: 512,
      timeout: Duration.minutes(2),
    });  

    if (props.grantRead) {
      props.table.grantReadData(this.lambdaFunction);
    }

    if (props.grantReadWrite) {
      props.table.grantReadWriteData(this.lambdaFunction);
    }
  }
}   

module.exports = { LambdaConstruct };