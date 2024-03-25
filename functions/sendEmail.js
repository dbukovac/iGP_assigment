const { Queue, Worker } = require('bullmq');
const redisConnection = require('./redis/redisConnection');
const logger = require("./winston/winstonLogger");

const emailQueue = new Queue('mailer', {
    connection: redisConnection
});

async function queueEmail(email) {
    try {
        await emailQueue.add('email', {
            to: email,
            subject: "Welcome email"
        });
    } catch (error) {
        logger.error("Failed to queue email", error);
    }
};

const worker = new Worker('mailer', 
    async job => {
        try {
            logger.info(`Sending email`, job.data);
            // await sendEmail(job.data.to, job.data.subject);
        } catch (error) {
            logger.error("Failed to send email", error);
        }
    },
    { connection: redisConnection }
);

module.exports.queueEmail = queueEmail;