const { pool } = require('../config/db');

const toItem = (row) => {
  if (!row) return null;

  return {
    _id: row.item_id,
    id: row.item_id,
    title: row.title,
    description: row.description,
    category: row.category,
    type: row.type,
    location: row.location,
    imageUrl: row.image_url,
    userId: row.user_id,
    status: row.status,
    createdAt: row.item_created_at,
    updatedAt: row.item_updated_at,
  };
};

const toRoom = (row) => {
  if (!row) return null;

  return {
    _id: row.id,
    id: row.id,
    itemId: toItem(row),
    participants: row.participants || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const roomSelect = `
  SELECT
    r.id,
    r.item_id,
    r.participants,
    r.created_at,
    r.updated_at,
    i.id AS item_id,
    i.title,
    i.description,
    i.category,
    i.type,
    i.location,
    i.image_url,
    i.user_id,
    i.status,
    i.created_at AS item_created_at,
    i.updated_at AS item_updated_at
  FROM rooms r
  JOIN items i ON i.id = r.item_id
`;

const findRoomForItemAndUsers = async (itemId, userA, userB) => {
  const result = await pool.query(
    `${roomSelect}
     WHERE r.item_id = $1 AND r.participants @> ARRAY[$2, $3]::text[]
     LIMIT 1`,
    [itemId, userA, userB]
  );

  return toRoom(result.rows[0]);
};

const createRoom = async (itemId, participants) => {
  const result = await pool.query(
    `
      INSERT INTO rooms (item_id, participants)
      VALUES ($1, $2)
      RETURNING *
    `,
    [itemId, participants]
  );

  return getRoomById(result.rows[0].id);
};

const getRoomById = async (id) => {
  const result = await pool.query(
    `${roomSelect}
     WHERE r.id = $1
     LIMIT 1`,
    [id]
  );

  return toRoom(result.rows[0]);
};

const getRoomsForUser = async (userId) => {
  const result = await pool.query(
    `${roomSelect}
     WHERE $1 = ANY(r.participants)
     ORDER BY r.updated_at DESC`,
    [userId]
  );

  return result.rows.map(toRoom);
};

const getRoomsByItemId = async (itemId) => {
  const result = await pool.query(
    `${roomSelect}
     WHERE r.item_id = $1
     ORDER BY r.updated_at DESC`,
    [itemId]
  );

  return result.rows.map(toRoom);
};

const touchRoom = async (roomId) => {
  await pool.query('UPDATE rooms SET updated_at = NOW() WHERE id = $1', [roomId]);
};

module.exports = { findRoomForItemAndUsers, createRoom, getRoomById, getRoomsForUser, getRoomsByItemId, touchRoom };
