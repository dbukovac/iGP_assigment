const kafka = require("./kafka/kafkaClient");

async function init(sockserver) {
    const consumer = kafka.consumer({ groupId: 'my-app' });
    await consumer.connect();

    await consumer.subscribe({ topic: "messages", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
        console.log(
            `[${topic}]: PART:${partition}:`,
            message.value.toString()
        );
        sockserver.clients.forEach(client => {
            console.log(`distributing message: ${message.value.toString()}`)
            client.send(`${message.value.toString()}`)
        })
        },
    });
}

module.exports.initKafkaMessagesClient = init;