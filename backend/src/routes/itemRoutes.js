const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const upload = require('../middleware/uploadImage');

router.post("/", upload.single("file"), itemController.createItem);
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItem);
router.patch('/:id/status', itemController.updateItemStatus);

module.exports = router;
