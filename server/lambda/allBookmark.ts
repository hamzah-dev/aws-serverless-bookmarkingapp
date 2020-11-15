import * as AWS from "aws-sdk";

const Client = new AWS.DynamoDB.DocumentClient();
const allBookmarks = async () => {
  const params: any = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
  };
  try {
    const result = await Client.scan(params).promise();
    return result.Items;
  } catch (err) {
    return err.toString();
  }
};

export default allBookmarks;
