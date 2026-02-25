const express = require("express");
const inventoryController = require("../controllers/inventoryController");
const { upload } = require("../middlewares/upload");

const router = express.Router();

// ========================
// Stats & Search (before :id to avoid conflicts)
// ========================
router.get("/stats", inventoryController.getStats);
router.get("/search", inventoryController.search);

// ========================
// CRUD Routes
// ========================
router.post("/", upload.single("image"), inventoryController.create);
router.get("/", inventoryController.getAll);
router.get("/:id", inventoryController.getById);
router.put("/:id", upload.single("image"), inventoryController.update);
router.delete("/:id", inventoryController.delete);
router.post(
  "/:id/sell",
  upload.single("customerPhoto"),
  inventoryController.sell,
);
router.post("/:id/restock", inventoryController.restock);
router.patch("/:id/archive", inventoryController.archive);
router.patch("/:id/unarchive", inventoryController.unarchive);

module.exports = router;
