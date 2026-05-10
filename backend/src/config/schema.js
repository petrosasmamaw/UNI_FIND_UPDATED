const { pool } = require('./db');

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
      location TEXT,
      image_url TEXT,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'not-delivered' CHECK (status IN ('not-delivered', 'delivered')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY,
      item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      participants TEXT[] NOT NULL DEFAULT '{}'::text[],
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
      sender_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_rooms_item_id ON rooms(item_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_rooms_participants ON rooms USING GIN (participants);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);`);
}

module.exports = { initSchema };