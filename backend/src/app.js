require('dotenv').config();
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');

const itemRoutes = require('./routes/itemRoutes');
const roomRoutes = require('./routes/roomRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { attachUser } = require('./middleware/authMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Allow the frontend to send custom headers like `x-user-id` for auth forwarding
app.use(cors({
	origin: true,
	allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'X-Requested-With'],
	credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

app.use(attachUser);

app.use('/api/items', itemRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

app.use(errorHandler);

module.exports = app;
