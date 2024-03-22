const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKABROKER],
});

module.exports = kafka;