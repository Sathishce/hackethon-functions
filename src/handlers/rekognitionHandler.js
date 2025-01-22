// src/handlers/rekognitionHandler.js
const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();
const sns = new AWS.SNS();

module.exports.analyzeImage = async (event) => {
  console.log('Received SNS event:', JSON.stringify(event, null, 2));

  const { bucketName, fileKey } = JSON.parse(event.Records[0].Sns.Message);

  try {
    const params = {
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: fileKey,
        },
      },
    };

    const rekognitionResult = await rekognition.detectLabels(params).promise();

    const resultMessage = {
      rekognitionResult,
      fileKey,
    };

    const snsParams = {
      Message: JSON.stringify(resultMessage),
      TopicArn: process.env.REKOGNITION_TOPIC_ARN,
    };
    await sns.publish(snsParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Rekognition analysis complete.',
      }),
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error analyzing image',
      }),
    };
  }
};
