const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middlewares/authenticateToken');

router.use(authenticateToken);

// Listar usuarios con los que puedo hablar según mi rol
router.get('/users', messageController.getAvailableUsers);

// Chat
router.get('/conversation/:userId', messageController.getConversation);

// Enviar un nuevo mensaje
router.post('/send', messageController.sendMessage);

module.exports = router;
