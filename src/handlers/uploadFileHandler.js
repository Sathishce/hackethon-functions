// src/handlers/uploadFileHandler.js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const sns = new AWS.SNS();

module.exports.uploadFile = async (event) => {
  const { fileContent, bucketName, fileKey } = JSON.parse(event.body);

  try {
    // Upload file to S3
    await s3.putObject({
      Bucket: bucketName,
      Key: fileKey,
      Body: Buffer.from(fileContent, 'base64'),
      ContentType: 'application/octet-stream',
    }).promise();

    // Publish SNS event to trigger Rekognition analysis
    const snsParams = {
      Message: JSON.stringify({ bucketName, fileKey }),
      TopicArn: process.env.REKOGNITION_TOPIC_ARN,
    };
    await sns.publish(snsParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File uploaded successfully and Rekognition triggered.' }),
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'File upload failed' }),
    };
  }
};
