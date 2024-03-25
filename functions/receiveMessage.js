const kafka = require("./kafka/kafkaClient");
const logger = require("./winston/winstonLogger");

async function init(sockserver) {
    const consumer = kafka.consumer({ groupId: 'my-app' });
    await consumer.connect();

    await consumer.subscribe({ topic: "messages", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            logger.info(`Consumer reading message: TOPIC: ${topic} PARTITION: ${partition} MESSAGE: ${message.value}, KEY: ${message.key}`);
            sockserver.clients.forEach(client => {
                if(!message.key || (message.key && message.key.toString() === client.id)) {
                    logger.info(`distributing message: ${message.value} to client: ${message.key}`);
                    client.send(`${message.value}`);
                }
            })
        },
    });
}

module.exports.initKafkaMessagesClient = init;