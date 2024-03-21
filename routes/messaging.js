const express = require('express');
const { sendMessage } = require('../functions/sendMessage');
const router = express.Router();

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
