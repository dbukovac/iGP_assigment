const kafka = require("./kafka/kafkaClient");
const logger = require("./winston/winstonLogger");

async function sendMessage(request) {
    const producer = kafka.producer();
    await producer.connect();
    logger.info("Producer Connected Successfully");
    const message = {
        value: request.message,
        key: request.email
    };

    await producer.send({
        topic: "messages",
        messages: [message],
    });
    logger.info("Producer created message successfully", message);
    await producer.disconnect();
}

module.exports.sendMessage = sendMessage;