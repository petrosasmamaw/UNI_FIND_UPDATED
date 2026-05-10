# UniFind Backend (MERN)

Simple Express + Mongoose REST API for a University Lost & Found system.

Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. Install dependencies:

```
cd backend
npm install
```

3. Run in dev:

```
npm run dev
```

API Endpoints

- `POST /api/items` - create item (body includes `userId` or header `x-user-id`)
- `GET /api/items` - list items with query `type`, `category`, `search`, `page`, `limit`
- `GET /api/items/:id` - get single item
- `POST /api/rooms` - create or get room (body: `itemId`, `interestedUserId`)
- `GET /api/rooms/:id` - get room
- `POST /api/messages` - send message (body: `roomId`, `content`, `senderId`)
- `GET /api/messages?roomId=...` - fetch messages for room

Auth

Authentication is handled by the frontend (Better Auth). Backend trusts user info forwarded from frontend.
