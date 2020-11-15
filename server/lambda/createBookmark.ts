import * as AWS from "aws-sdk";
import { bookmarkType } from "./bookmark";

const Client = new AWS.DynamoDB.DocumentClient();
const createBookmark = async (newBookmark: bookmarkType) => {
  const params: any = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: newBookmark,
  };
  try {
    await Client.put(params).promise();
    return newBookmark;
  } catch (error) {
    return error.toString();
  }
};
export default createBookmark;
