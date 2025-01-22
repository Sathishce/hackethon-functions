// src/handlers/saveRekognitionResult.js
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

module.exports.save = async (event) => {
  console.log('Received SNS event:', JSON.stringify(event, null, 2));

  const { rekognitionResult, fileKey } = JSON.parse(event.Records[0].Sns.Message);

  const params = {
    TableName: TABLE_NAME,
    Item: {
      fileKey,
      rekognitionResult,
      timestamp: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Rekognition result saved.',
      }),
    };
  } catch (error) {
    console.error('Error saving Rekognition result:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error saving Rekognition result',
      }),
    };
  }
};
