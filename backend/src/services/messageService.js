const { pool } = require('../config/db');
const { touchRoom } = require('./roomService');

const toMessage = (row) => {
  if (!row) return null;

  return {
    _id: row.id,
    id: row.id,
    roomId: row.room_id,
    senderId: row.sender_id,
    content: row.content,
    createdAt: row.created_at,
  };
};

const createMessage = async ({ roomId, senderId, content }) => {
  const result = await pool.query(
    `
      INSERT INTO messages (room_id, sender_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [roomId, senderId, content]
  );

  await touchRoom(roomId);
  return toMessage(result.rows[0]);
};

const getMessagesByRoom = async (roomId) => {
  const result = await pool.query(
    `
      SELECT *
      FROM messages
      WHERE room_id = $1
      ORDER BY created_at ASC
    `,
    [roomId]
  );

  return result.rows.map(toMessage);
};

module.exports = { createMessage, getMessagesByRoom };
