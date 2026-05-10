const { pool } = require('../config/db');

const toItem = (row) => {
  if (!row) return null;

  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    type: row.type,
    location: row.location,
    imageUrl: row.image_url,
    userId: row.user_id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const createItem = async (data) => {
  const result = await pool.query(
    `
      INSERT INTO items (title, description, category, type, location, image_url, user_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
    [
      data.title,
      data.description || null,
      data.category || null,
      data.type,
      data.location || null,
      data.imageUrl || null,
      data.userId,
      data.status || 'not-delivered',
    ]
  );

  return toItem(result.rows[0]);
};

const updateItemImageUrl = async (itemId, imageUrl) => {
  const result = await pool.query(
    `
      UPDATE items
      SET image_url = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [itemId, imageUrl]
  );

  return toItem(result.rows[0]);
};

const getItems = async ({ type, category, search, page = 1, limit = 20, userId } = {}) => {
  const filters = [];
  const values = [];

  if (type) {
    values.push(type);
    filters.push(`type = $${values.length}`);
  }

  if (category) {
    values.push(category);
    filters.push(`category = $${values.length}`);
  }

  if (userId) {
    values.push(userId);
    filters.push(`user_id = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    filters.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
  }

  const offset = (page - 1) * limit;
  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  const itemsQuery = `
    SELECT *
    FROM items
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM items
    ${whereClause}
  `;

  const [itemsResult, totalResult] = await Promise.all([
    pool.query(itemsQuery, [...values, limit, offset]),
    pool.query(countQuery, values),
  ]);

  return {
    items: itemsResult.rows.map(toItem),
    total: totalResult.rows[0]?.total || 0,
    page,
    limit,
  };
};

const getItemById = async (id) => {
  const result = await pool.query('SELECT * FROM items WHERE id = $1 LIMIT 1', [id]);
  return toItem(result.rows[0]);
};

const updateItemStatus = async (itemId, userId, status) => {
  const existing = await pool.query('SELECT * FROM items WHERE id = $1 LIMIT 1', [itemId]);
  const item = existing.rows[0];

  if (!item) {
    throw new Error('Item not found');
  }

  if (item.user_id !== userId) {
    throw new Error('Unauthorized: Only item creator can update status');
  }

  if (!['not-delivered', 'delivered'].includes(status)) {
    throw new Error('Invalid status value');
  }

  const result = await pool.query(
    `
      UPDATE items
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [itemId, status]
  );

  return toItem(result.rows[0]);
};

module.exports = { createItem, getItems, getItemById, updateItemStatus, updateItemImageUrl };
