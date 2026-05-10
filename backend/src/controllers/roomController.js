const roomService = require('../services/roomService');
const itemService = require('../services/itemService');

const getOrCreateRoom = async (req, res) => {
  const { itemId, interestedUserId } = req.body;
  if (!itemId || !interestedUserId) return res.status(400).json({ message: 'itemId and interestedUserId required' });

  const item = await itemService.getItemById(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  const ownerId = item.userId;
  if (!ownerId) return res.status(400).json({ message: 'Item has no owner' });

  if (ownerId === interestedUserId) return res.status(400).json({ message: 'Item owner cannot message themselves' });

  const existing = await roomService.findRoomForItemAndUsers(itemId, ownerId, interestedUserId);
  if (existing) return res.json(existing);

  const room = await roomService.createRoom(itemId, [ownerId, interestedUserId]);
  res.status(201).json(room);
};

const getRoom = async (req, res) => {
  const room = await roomService.getRoomById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(room);
};

const listRoomsForUser = async (req, res) => {
  const userId = req.query.userId || (req.user && req.user.id);
  if (!userId) return res.status(400).json({ message: 'userId required' });
  const rooms = await roomService.getRoomsForUser(userId);
  res.json(rooms);
};

const getRoomsForItem = async (req, res) => {
  const { itemId } = req.params;
  if (!itemId) return res.status(400).json({ message: 'itemId required' });

  try {
    const item = await itemService.getItemById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const rooms = await roomService.getRoomsByItemId(itemId);
    res.json(rooms);
  } catch (err) {
    console.error('Error fetching rooms for item:', err);
    res.status(500).json({ message: 'Failed to fetch rooms', details: err.message });
  }
};

module.exports = { getOrCreateRoom, getRoom, listRoomsForUser, getRoomsForItem };
