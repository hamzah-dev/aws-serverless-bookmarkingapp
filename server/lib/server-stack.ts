import * as cdk from "@aws-cdk/core";
import * as appSync from "@aws-cdk/aws-appsync";
import * as dynamoDB from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";

export class ServerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // s3 bucket
    const bucket = new s3.Bucket(this, "s3Bucket", {
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
    });
    //s3 bucket deployment and specifying that where is the content
    new s3Deployment.BucketDeployment(this, "bucketDeployment", {
      sources: [s3Deployment.Source.asset("../public")],
      destinationBucket: bucket,
    });
    //cloudfront (aws cdn)
    new cloudfront.Distribution(this, "DistributionWebBucket", {
      defaultBehavior: { origin: new origins.S3Origin(bucket) },
    });

    //creating api
    const api = new appSync.GraphqlApi(this, "BookmarkApi", {
      name: "Bookmark_Graphql_api",
      schema: appSync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appSync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });

    //this will print graogql url in the terminal
    new cdk.CfnOutput(this, "graphqlApiUrl", {
      value: api.graphqlUrl,
    });
    //this will print graphql key in the terminal
    new cdk.CfnOutput(this, "GraphqlApiKey", {
      value: api.apiKey || "",
    });

    //this will print api id in the terminal
    new cdk.CfnOutput(this, "region", {
      value: this.region,
    });

    //creating dynamodb table
    const bookmarkTable = new dynamoDB.Table(this, "DynamoBookmarkTable", {
      billingMode: dynamoDB.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: dynamoDB.AttributeType.STRING,
      },
    });

    // creating Lambda function
    const LambdaFunc = new lambda.Function(this, "BookmarkHandler", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "bookmarkApi.handler",
      memorySize: 1024,
      environment: {
        DYNAMODB_TABLE_NAME: bookmarkTable.tableName,
      },
    });

    //create lambda function as a data source
    const lambdaDataSource = api.addLambdaDataSource(
      "Lambdadatasource",
      LambdaFunc
    );

    lambdaDataSource.createResolver({
      typeName: "Query",
      fieldName: "allBookmarks",
    });
    lambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createBookmark",
    });
    lambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteBookmark",
    });

    // giving permission to lambda functions to access dynamoTable using IAM
    bookmarkTable.grantFullAccess(LambdaFunc);
  }
}
