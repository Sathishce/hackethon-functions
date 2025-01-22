// src/handlers/saveRekognitionResult.js
const { saveToDynamo } = require('../utils/dynamoUtils');  // Import saveToDynamo function
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

module.exports.save = async (event) => {
  console.log('Received SNS event:', JSON.stringify(event, null, 2));

  const { rekognitionResult, fileKey } = JSON.parse(event.Records[0].Sns.Message);

  // Prepare the item to be saved to DynamoDB
  const params = {
    TableName: TABLE_NAME,
    Item: {
      fileKey,  // The key of the file in S3
      rekognitionResult,  // The result of Rekognition
      timestamp: new Date().toISOString(),  // The timestamp of when the result was saved
    },
  };

  try {
    // Use the utility function to save the result to DynamoDB
    await saveToDynamo(params);  
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
