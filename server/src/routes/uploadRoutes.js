const express = require("express");
const inventoryController = require("../controllers/inventoryController");
const { upload } = require("../middlewares/upload");

const router = express.Router();

// ========================
// Standalone Image Upload/Delete
// ========================

// Upload image (from camera or gallery)
router.post("/image", upload.single("image"), inventoryController.uploadImage);

// Delete image by Cloudinary publicId
router.delete("/image/:publicId", inventoryController.deleteImage);

module.exports = router;
