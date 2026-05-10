require('dotenv').config();
const path = require('path');
const { pathToFileURL } = require('url');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { initSchema } = require('./src/config/schema');

const PORT = process.env.PORT || 5000;

async function mountAuthHandler() {
  const authModuleUrl = pathToFileURL(path.join(__dirname, './auth.mjs')).href;
  const mod = await import(authModuleUrl);

  app.get('/api/auth/get-session', async (req, res) => {
    try {
      const session = await mod.auth.api.getSession({
        headers: new Headers(req.headers),
      });
      res.json(session || null);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get session' });
    }
  });

  if (mod?.nodeHandler) {
    app.use('/api/auth', mod.nodeHandler);
    console.log('Mounted Better Auth handler at /api/auth');
  }
}

async function start() {
  try {
    await connectDB();
    await mountAuthHandler();
    await initSchema();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize server', err);
    process.exit(1);
  }
}

start();
