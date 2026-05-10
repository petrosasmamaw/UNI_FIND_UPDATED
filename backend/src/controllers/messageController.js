const messageService = require('../services/messageService');

const isValidRoomId = (roomId) => Number.isInteger(Number(roomId)) && Number(roomId) > 0;

const sendMessage = async (req, res) => {
  const { roomId, content } = req.body;
  const senderId = req.body.senderId || (req.user && req.user.id);
  
  if (!roomId || !content || !senderId) {
    return res.status(400).json({ message: 'roomId, content and senderId required' });
  }

  if (!isValidRoomId(roomId)) {
    return res.status(400).json({ message: 'Invalid roomId' });
  }

  if (content.toString().trim().length === 0) {
    return res.status(400).json({ message: 'Message content cannot be empty' });
  }

  try {
    const msg = await messageService.createMessage({ roomId, senderId, content: content.toString().trim() });
    res.status(201).json(msg);
  } catch (err) {
    console.error('Error creating message:', err);
    res.status(500).json({ message: 'Failed to send message', details: err.message });
  }
};

const getMessages = async (req, res) => {
  const { roomId } = req.query;
  if (!roomId) return res.status(400).json({ message: 'roomId required' });
  
  if (!isValidRoomId(roomId)) {
    return res.status(400).json({ message: 'Invalid roomId' });
  }

  try {
    const msgs = await messageService.getMessagesByRoom(roomId);
    res.json(msgs);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages', details: err.message });
  }
};

module.exports = { sendMessage, getMessages };
