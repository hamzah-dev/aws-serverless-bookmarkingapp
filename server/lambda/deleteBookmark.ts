import * as AWS from "aws-sdk";

const Client = new AWS.DynamoDB.DocumentClient();

const deleteBookmark = async (bookmarkId: string) => {
  const params: any = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      id: bookmarkId,
    },
  };

  try {
    await Client.delete(params).promise();
  } catch (error) {
    return error.toString();
  }
};
export default deleteBookmark;
