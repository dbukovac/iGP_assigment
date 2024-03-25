const express = require('express');
const { sendMessage } = require('../functions/sendMessage');
const router = express.Router();

/**
 * @swagger
 * /messaging/sendMessage:
 *   post:
 *     summary: Sends a message to all logged in users
 *     tags: [Messages]
 *     requestBody:
 *       description: Message to send to all logged in users
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *             example:
 *                message: "poruka"
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
    await sendMessage(request.body.message);
    console.log("Message sent");
    return response.status(200).json({ message: 'Message sent' });
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

module.exports = router;
