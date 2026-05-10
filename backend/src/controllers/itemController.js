const itemService = require('../services/itemService');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const createItem = async (req, res) => {
  const payload = req.body || {};
  // trust userId from frontend (Better Auth). If frontend sends user in header, attachUser middleware sets req.user
  payload.userId = payload.userId || (req.user && req.user.id) || payload.userId;

  if (!payload.userId) {
    return res.status(400).json({ message: 'Missing userId. Ensure you are logged in or send x-user-id header.' });
  }

  // Validate required fields
  if (!payload.title || !payload.type) {
    return res.status(400).json({ message: 'title and type are required' });
  }

  if (!['lost', 'found'].includes(payload.type)) {
    return res.status(400).json({ message: 'type must be "lost" or "found"' });
  }

  // Handle file cases:
  // - If multer-storage-cloudinary already uploaded the file, `req.file.path` (or secure_url) will be present.
  // - If multer.memoryStorage was used, `req.file.buffer` will contain the image buffer; we'll upload it asynchronously.
  const hasUploadedUrl = req.file && (req.file.path || req.file.secure_url || req.file.url || req.file.location);
  const hasBufferFile = req.file && req.file.buffer;

  if (hasUploadedUrl) {
    payload.imageUrl = req.file.path || req.file.secure_url || req.file.url || req.file.location;
  }

  try {
    // create item immediately (without waiting for background upload)
    const item = await itemService.createItem(payload);

    if (hasBufferFile) {
      // upload buffer to Cloudinary asynchronously and update item when done
      (async () => {
        try {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: 'mern_uploads', resource_type: 'image' }, async (error, result) => {
            if (error) {
              console.error('Cloudinary upload failed for item', item._id, error);
              return;
            }
            try {
              await itemService.updateItemImageUrl(item._id, result.secure_url);
            } catch (e) {
              console.error('Failed to update item with imageUrl', item._id, e);
            }
          });

          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        } catch (e) {
          console.error('Async upload error:', e);
        }
      })();
    }

    return res.status(201).json(item);
  } catch (err) {
    console.error('Error creating item:', err);
    return res.status(500).json({ message: 'Failed to create item', details: err.message || err.toString() });
  }
};

const getItems = async (req, res) => {
  try {
    const { type, category, search, page, limit, userId } = req.query;
    const result = await itemService.getItems({ 
      type, 
      category, 
      search, 
      page: Number(page) || 1, 
      limit: Number(limit) || 20, 
      userId 
    });
    res.json(result);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Failed to fetch items', details: err.message });
  }
};

const getItem = async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ message: 'Failed to fetch item', details: err.message });
  }
};

const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.body.userId || (req.user && req.user.id);

    if (!userId) {
      return res.status(400).json({ message: 'Missing userId. Ensure you are logged in.' });
    }

    if (!status) {
      return res.status(400).json({ message: 'status field is required' });
    }

    const updatedItem = await itemService.updateItemStatus(id, userId, status);
    return res.json(updatedItem);
  } catch (err) {
    console.error('Error updating item status:', err);
    
    if (err.message.includes('not found')) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (err.message.includes('Unauthorized')) {
      return res.status(403).json({ message: 'Unauthorized: Only item creator can update status' });
    }
    
    if (err.message.includes('Invalid status')) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    return res.status(500).json({ message: 'Failed to update item status', details: err.message });
  }
};

module.exports = { createItem, getItems, getItem, updateItemStatus };
