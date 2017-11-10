'use strict';

const RekognitionDao = require('./lib/rekognitionDao');
const DynamoDbDao = require('./lib/dynamoDbDao');

module.exports.processImage = (event, context, callback) => {
    const bodyObject = JSON.parse(event.body);
    RekognitionDao.imageContainsCar(bodyObject, function (vehicleType, err) {

        if (err) {
            console.log('Error identifying image:', err);
            callback(null, {
                statusCode: 400,
                body: JSON.stringify({
                    error: err
                })
            });
        } else if (vehicleType) {
            console.log(`Detected '${vehicleType}' going '${bodyObject.eventType}'`);
            DynamoDbDao.insertEvent(bodyObject.eventType, vehicleType, function (err, data) {
                if (err) {
                    console.log('Error updating database:', err);
                } else {
                    console.log('Successfully updated database');
                }
            });
        }

        callback(null, {
            statusCode: 201
        });
    });
};
