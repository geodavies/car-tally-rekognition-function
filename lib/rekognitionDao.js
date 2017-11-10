'use strict';

const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

class RekognitionDao {

    static imageContainsCar(requestBody, callback) {
        if (!requestBody || !requestBody.hasOwnProperty('image')) {
            callback(undefined, 'Could not find \'image\' in request JSON');
            return;
        }

        const imageBuffer = Buffer.from(requestBody.image, 'base64');

        const params = {
            Image: {
                Bytes: imageBuffer
            },
            MaxLabels: 10,
            MinConfidence: 50
        };

        rekognition.detectLabels(params, (err, data) => {
            if (err) {
                callback(undefined, err);
            } else {
                const labels = data.Labels;

                const vehicleType = {
                    motorcycle: false,
                    car: false,
                    van: false,
                    bicycle: false
                };

                for (let i = 0; i < labels.length; i++) {
                    if (labels[i].Name === 'Motorcycle') vehicleType.motorcycle = true;
                    if (labels[i].Name === 'Car') vehicleType.car = true;
                    if (labels[i].Name === 'Van') vehicleType.van = true;
                    if (labels[i].Name === 'Bicycle') vehicleType.bicycle = true;
                }

                if (vehicleType.motorcycle) {
                    callback('Motorcycle', undefined);
                } else if (vehicleType.van) {
                    callback('Van', undefined);
                } else if (vehicleType.car) {
                    callback('Car', undefined);
                } else if (vehicleType.bicycle) {
                    callback('Bicycle', undefined);
                } else {
                    console.log('Failed to detect vehicle type');
                    callback(undefined, undefined);
                }
            }
        });
    }

}

module.exports = RekognitionDao;
