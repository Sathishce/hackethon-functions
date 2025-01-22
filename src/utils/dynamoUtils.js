// src/utils/dynamoUtils.js
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.saveToDynamo = async (params) => {
  try {
    await dynamoDB.put(params).promise();
  } catch (error) {
    console.error('Error saving to DynamoDB:', error);
    throw new Error('DynamoDB save failed');
  }
};

module.exports.getFromDynamo = async (params) => {
  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error('Error fetching from DynamoDB:', error);
    throw new Error('DynamoDB fetch failed');
  }
};
