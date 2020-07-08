const { v4: UUIDv4 } = require("uuid"),
    ErrorResponses = require("./constants/errorResponses"),
    SuccessResponses = require("./constants/successResponses"),
    mongoose = require('mongoose'),
    Notification = require('./models/notification');
let isConnected;
mongoose.Promise = global.Promise;

/**
 * BaseController class.
 */
class BaseObject {
    /**
     * Create a BaseObject.
     * @param {object} event - The event object.
     */
    constructor(event) {
        this.event = event;
    }

    /**
     * Function create the response.
     * @return {object} Response object.
     */
    createErrorResponse(statusName, message = null, error = null) {
        let status;
        error = typeof error === "string" ? JSON.parse(error) : error;
        if (error && error.status && error.status.code) {
            status = Object.assign({}, error);
        } else {
            status = Object.assign({}, ErrorResponses[statusName]);
            status.status.identifier = this.extractTraceID();
            status.status.date = this.getDate();
            if (message) {
                status.status.message = message
            }
        }
        return JSON.stringify(status);
    }


    /**
     * Function create the response.
     * @return {object} Response object.
     */
    createResponse(body = null) {
        if (process.env.IS_OFFLINE) return body;
        let status = Object.assign({}, SuccessResponses["SUCCESS"]);
        status.status.identifier = this.extractTraceID();
        status.status.date = this.getDate();
        if (body) {
            status.body = body;
        }
        return status;
    }

    /**
     * Function to get the date.
     * @return {object} Date in json format.
     */

    getDate() {
        let date = new Date();
        return date.toJSON();
    }

    /**
     * Function to create a UUID.
     * @return {string} UUID.
     */
    createUUIDv4() {
        return UUIDv4().toString();
    }

    /**
     * Function to get or create a traceID.
     * @return {string} traceID.
     */
    extractTraceID() {
        if (!this.event.headers || !this.event.headers["X-Amzn-Trace-Id"]) {
            return this.createUUIDv4();
        }
        let amzIDHeader = String(this.event.headers["X-Amzn-Trace-Id"]);
        let match = amzIDHeader.match(/^(Root=\d-)+(.*)$/);
        if (!match || !match[2]) {
            return this.createUUIDv4();
        }
        return match[2];
    }

    async connectToDatabase() {
        if (isConnected) {
            return Promise.resolve();
        }
        const db = await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
        isConnected = db.connections[0].readyState;
    }

    convertObjectId(id) {
        return new mongoose.mongo.ObjectId(id);
    }

    createNotification(usersId, message) {
        this.connectToDatabase();
        let data = {
            usersDestination: usersId,
            message: message
        }
        Notification.create(data, function (err, notification) {
            if (err) console.log(error);
        });
    }

}
module.exports = BaseObject;