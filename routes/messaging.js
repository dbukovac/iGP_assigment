const express = require('express');
const { sendMessage } = require('../functions/sendMessage');
const logger = require('../functions/winston/winstonLogger');
const router = express.Router();

/**
 * @swagger
 * /messaging/sendMessage:
 *   post:
 *     summary: Sends a message to logged in users, use email to send message to specific user
 *     tags: [Messages]
 *     requestBody:
 *       description: Message to send to all logged in users, use email to send message to specific user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *                { message: "poruka", email: "netko@gmail.com" }
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [{ message: 'Message sent' }]
 *       400:
 *         description: Invalid request
 */
router.post('/sendMessage', async (request, response) => {
  try {
    await sendMessage(request.body);
    return response.status(200).json({ message: 'Message sent' });
  } catch (error) {
    logger.error(err.message, err);
    return response.status(400).json({ message: error.message });
  }
});

module.exports = router;
