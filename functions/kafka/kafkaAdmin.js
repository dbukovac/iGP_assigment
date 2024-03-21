const kafka = require("./kafkaClient");

async function init() {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  admin.connect();
  console.log("Admin Connection Success...");

  console.log("Creating Topic [messages]");
  await admin.createTopics({
    topics: [
      {
        topic: "messages",
        numPartitions: 1,
      },
    ],
  });
  console.log("Topic Created Success [messages]");

  console.log("Disconnecting Admin..");
  await admin.disconnect();
}

module.exports.initKafkaMessagesTopic = init;