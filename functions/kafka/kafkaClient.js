const { Kafka } = require("kafkajs");
const config = require('config');

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [config.get("KAFKABROKER")]
});

module.exports = kafka;