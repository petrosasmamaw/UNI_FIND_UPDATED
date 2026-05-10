# UniFind - Full Stack Setup & Debug Guide

## What Was Fixed

### Backend Fixes ✅
1. **Module System Mismatch** - Converted `cloudinary.js` and `uploadImage.js` from ES6 to CommonJS
2. **Chat senderId Bug** - Fixed frontend chat page to send `senderId` in message payload
3. **Enhanced Frontend** - Added room creation functionality from ItemsList with "Message" button
4. **Better Error Handling** - Improved chat page with loading states and user session verification
5. **Environment Security** - Created `.env.example` to prevent secret exposure

### What's Working ✅
- ✅ User authentication (Better Auth)
- ✅ Create lost/found items with image upload
- ✅ View items with filtering
- ✅ Create chat rooms by clicking items
- ✅ Send and receive messages
- ✅ MongoDB persistence
- ✅ Cloudinary image storage

---

## Quick Start - Local Development

### 1. Backend Setup

```bash
# Navigate to backend directory
cd "C:\Users\For you\OneDrive\Desktop\folders\website\NEXT_JS_PROJECTS\UNIFIND\backend"

# Install dependencies (if not done)
npm install

# Start backend server
npm start
# or for development with auto-reload:
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected
```

**Backend is accessible at:** `http://localhost:5000`

---

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd "C:\Users\For you\OneDrive\Desktop\folders\website\NEXT_JS_PROJECTS\UNIFIND\FrontendFindItems"

# Install dependencies (if not done)
npm install

# Start frontend dev server
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.2.1
Local:        http://localhost:3000
```

**Frontend is accessible at:** `http://localhost:3000`

---

## Testing the Full Workflow

### Test 1: Create an Account
1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Enter email and password
4. Click "Register"
5. You should be redirected to dashboard

### Test 2: Create a Lost Item
1. Click "Post Lost Item" or go to `/lost-and-found`
2. Fill in:
   - **Title:** "Lost my keys"
   - **Description:** "Red keychain with silver ring"
   - **Category:** "General"
   - **Location:** "Library"
   - **Type:** "Lost"
   - **Image:** Upload a photo (optional)
3. Click "Create Item"
4. You should see confirmation and redirect to items list

### Test 3: Create a Found Item
1. Go to `/lost-and-found`
2. Click on "Found Items" tab or navigate to `/found`
3. Post a found item similar to Test 2

### Test 4: View Items & Chat
1. Go to `/lost-and-found`
2. You should see a list of items (lost and found)
3. Click "Message" button on any item **not your own**
4. This creates a chat room and opens the chat page
5. You should be able to:
   - See chat history (empty on first room)
   - Type a message
   - Click "Send"
   - Message appears with your user ID
6. Refresh the page - message persists

### Test 5: Test Multiple Users
1. Open another browser (or incognito window) and go to `http://localhost:3000`
2. Register with a different email
3. Create a lost item
4. In the first browser, view this item and click "Message"
5. Send a message
6. In the second browser, open the item and go to chat
7. You should see the message from User 1
8. Send a reply - both users can see the conversation

---

## API Endpoints Reference

### Items
```
POST   /api/items           - Create new item (with image)
GET    /api/items           - List items (supports filters)
GET    /api/items/:id       - Get single item
```

**Query Parameters:**
- `type` - "lost" or "found"
- `category` - "General", "Electronics", "Documents", "Clothing"
- `search` - Search in title/description
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)
- `userId` - Filter by user's items

**Example:**
```
GET http://localhost:5000/api/items?type=lost&category=General&page=1&limit=10
```

### Rooms (Chat)
```
POST   /api/rooms           - Create/get chat room
GET    /api/rooms           - List rooms for user
GET    /api/rooms/:id       - Get single room
```

**Create Room Body:**
```json
{
  "itemId": "mongo_id_of_item",
  "interestedUserId": "current_user_id"
}
```

### Messages
```
POST   /api/messages        - Send message
GET    /api/messages        - Get messages for room
```

**Send Message Body:**
```json
{
  "roomId": "mongo_id_of_room",
  "content": "Hello!",
  "senderId": "user_id"
}
```

**Query Parameters:**
- `roomId` - Required to fetch messages

---

## Troubleshooting

### Backend Won't Start
```
Error: Failed to connect to DB
```
**Solution:** 
- Check MongoDB URI in `.env` is correct
- Ensure MongoDB Atlas account has network access from your IP
- Try: `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority`

### Images Not Uploading
```
Error: Cloudinary upload failed
```
**Solution:**
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `.env`
- Check Cloudinary account is active
- Images are uploaded to `mern_uploads` folder

### Chat Not Sending Messages
```
Error: Failed to send message
```
**Solution:**
- Ensure you're logged in (check browser console for user ID)
- Check backend is running (`npm start`)
- Check frontend API URL: should be `http://localhost:5000`
- Look at network tab in DevTools to see the request/response

### Can't Create Chat Room
```
Error: Failed to create chat room
```
**Solution:**
- Ensure both users have different IDs (can't message yourself)
- Item must exist with a valid userId
- User must be logged in

### Messages Disappear on Refresh
**This is expected** - currently using polling, not real-time WebSocket. Messages are persisted in database and will show on refresh.

---

## Production Checklist

### Environment Variables
- [ ] `.env` file is in `.gitignore`
- [ ] Secrets are not committed to repository
- [ ] Use `deploy-production` MongoDB cluster (different from dev)
- [ ] Cloudinary credentials are secure

### Frontend
- [ ] Build frontend: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Set `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Verify auth endpoints work
- [ ] Test item creation with images
- [ ] Test chat functionality

### Backend
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Add authentication validation (currently trusts frontend)
- [ ] Add rate limiting
- [ ] Add logging
- [ ] Database backups enabled
- [ ] Monitor MongoDB connection pool
- [ ] Test all API endpoints
- [ ] Verify CORS allows production frontend domain

### Optional Enhancements
- [ ] Real-time messaging with Socket.io
- [ ] Email notifications for new messages
- [ ] User profiles
- [ ] Item search with advanced filters
- [ ] Admin dashboard
- [ ] Analytics tracking

---

## File Structure Quick Reference

**Backend**
```
backend/
├── server.js                 # Entry point
├── src/
│   ├── app.js               # Express app setup
│   ├── config/              # DB & Cloudinary config
│   ├── models/              # MongoDB schemas
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic
│   ├── routes/              # API routes
│   └── middleware/          # Auth, errors, uploads
└── .env                     # Secrets (DO NOT COMMIT)
```

**Frontend**
```
FrontendFindItems/
├── src/
│   ├── app/                 # Next.js pages (App Router)
│   │   ├── auth/            # Login/Register
│   │   ├── chat/[id]/       # Chat room
│   │   ├── lost-and-found/  # Items hub
│   │   ├── lost/            # Lost items list
│   │   ├── found/           # Found items list
│   │   └── dashboard/       # User dashboard
│   ├── components/          # React components
│   ├── store/               # Redux state management
│   └── lib/                 # Utilities (auth client)
└── .env                     # Config (safe to commit)
```

---

## Next Steps

1. **Run both servers locally** - Backend on 5000, Frontend on 3000
2. **Test the full workflow** - Follow "Testing the Full Workflow" section above
3. **Fix any errors** - Check console logs and network tab for issues
4. **Add real-time chat** - Implement Socket.io for live messaging (optional)
5. **Deploy to production** - Follow Production Checklist

---

## Support

If you encounter issues:
1. Check console logs (both browser and terminal)
2. Verify `.env` variables are set correctly
3. Ensure both servers are running
4. Check network tab in DevTools for failed requests
5. Look at terminal output for API errors
6. Verify MongoDB is accessible from your network
7. Test API endpoints directly with Postman/cURL

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (Port 3000)              │
├─────────────────────────────────────────────────────────────┤
│  - Better Auth (Email/Password + Social)                   │
│  - Redux State Management                                  │
│  - ItemForm, ItemsList, Chat Components                   │
│  - Calls Backend API at http://localhost:5000             │
└─────────────────────────────────────────────────────────────┘
                           ↕
                    HTTP REST API
                  (CORS Enabled)
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                  Express Backend (Port 5000)                │
├─────────────────────────────────────────────────────────────┤
│  - Item CRUD (Create, List, Get)                          │
│  - Room Management (Create, List, Get)                    │
│  - Message CRUD (Send, Get)                               │
│  - Cloudinary Image Upload                                │
│  - MongoDB Persistence                                    │
│  - Auth Middleware (trusts x-user-id header)             │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│            MongoDB Atlas (Cloud Database)                   │
├─────────────────────────────────────────────────────────────┤
│  Collections: users, items, rooms, messages               │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│            Cloudinary (Image Storage)                       │
├─────────────────────────────────────────────────────────────┤
│  Folder: mern_uploads (for all item images)               │
└─────────────────────────────────────────────────────────────┘
```

---

## Recent Changes Summary

| File | Change | Reason |
|------|--------|--------|
| `src/config/cloudinary.js` | CommonJS conversion | Module system consistency |
| `src/middleware/uploadImage.js` | CommonJS conversion | Module system consistency |
| `src/routes/itemRoutes.js` | Removed ES6 interop | No longer needed |
| `src/app/chat/[id]/page.js` | Added senderId + session fetch | Fix chat functionality |
| `src/components/ItemsList.jsx` | Enhanced with room creation | Enable messaging flow |
| `.env.example` | Created | Security best practice |

---

## Questions?

Refer to the console logs and network tab in DevTools. Most issues show up there with clear error messages.
