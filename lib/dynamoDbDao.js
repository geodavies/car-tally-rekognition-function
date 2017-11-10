'use strict';

const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

class DynamoDbDao {

    static insertEvent (eventType, vehicleType, callback) {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: 'CarTallyEvents',
            Item: {
                id: uuidv4(),
                eventType: eventType,
                vehicleType: vehicleType,
                date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') //
            }
        };

        docClient.put(params, callback);
    }

}

module.exports = DynamoDbDao;
