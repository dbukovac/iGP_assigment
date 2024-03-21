const { Queue, Worker } = require('bullmq');
const redisConnection = require('./redis/redisConnection');

const emailQueue = new Queue('mailer', {
    connection: redisConnection
});

async function queueEmail(email) {
    await emailQueue.add('email', {
        to: email,
        subject: "Welcome email"
    });
};

const worker = new Worker('mailer', 
    async job => {
        try {
            console.log(job.data.to, job.data.subject);
            // await sendEmail(job.data.to, job.data.subject);
        } catch (error) {
            console.log(error);
        }
    },
    { connection: redisConnection }
);

module.exports.queueEmail = queueEmail;