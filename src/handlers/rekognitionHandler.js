// src/handlers/saveRekognitionResult.js
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME; // Fetch the DynamoDB table name from environment variables

module.exports.save = async (event) => {
  console.log('Received SNS event:', JSON.stringify(event, null, 2));

  // Extract Rekognition result and fileKey from the SNS message
  const { rekognitionResult, fileKey } = JSON.parse(event.Records[0].Sns.Message);

  // Prepare the item to be saved to DynamoDB
  const params = {
    TableName: TABLE_NAME,
    Item: {
      fileKey, // The key of the file in S3
      rekognitionResult, // The result of Rekognition
      timestamp: new Date().toISOString(), // The timestamp of when the result was saved
    },
  };

  try {
    // Save the result to DynamoDB
    await dynamoDB.put(params).promise();
    console.log('Rekognition result saved to DynamoDB');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Rekognition result saved successfully.',
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
