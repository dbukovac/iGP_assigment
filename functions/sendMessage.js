const kafka = require("./kafka/kafkaClient");

async function sendMessage(message) {
    const producer = kafka.producer();

    console.log("Connecting Producer");
    await producer.connect();
    console.log("Producer Connected Successfully");

    await producer.send({
        topic: "messages",
        messages: [
            {
                value: message,
            },
        ],
    });
    console.log("Producer Sent Successfully");
    await producer.disconnect();
    console.log("Producer Disconnected Successfully");
}

module.exports.sendMessage = sendMessage;