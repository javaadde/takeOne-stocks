const inventoryService = require("../services/inventoryService");

class InventoryController {
  /**
   * POST /api/inventory
   * Create a new inventory item
   */
  async create(req, res) {
    try {
      const item = await inventoryService.createItem(req.body, req.file);
      res.status(201).json({
        success: true,
        message: "Item created successfully",
        data: item,
      });
    } catch (error) {
      const statusCode =
        error.message === "Item already exists in inventory" ? 409 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        existingItem: error.item || null,
      });
    }
  }

  /**
   * GET /api/inventory
   * Get all items with optional filters & pagination
   */
  async getAll(req, res) {
    try {
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        brand,
        status,
        search,
        minPrice,
        maxPrice,
      } = req.query;

      const filters = { brand, status, search, minPrice, maxPrice };
      const options = { page, limit, sortBy, sortOrder };

      const result = await inventoryService.getAllItems(filters, options);
      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/inventory/:id
   * Get a single item by ID
   */
  async getById(req, res) {
    try {
      const item = await inventoryService.getItemById(req.params.id);
      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      const statusCode = error.message === "Item not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/inventory/:id
   * Update an inventory item
   */
  async update(req, res) {
    try {
      const item = await inventoryService.updateItem(
        req.params.id,
        req.body,
        req.file,
      );
      res.status(200).json({
        success: true,
        message: "Item updated successfully",
        data: item,
      });
    } catch (error) {
      const statusCode = error.message === "Item not found" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /api/inventory/:id
   * Delete an inventory item
   */
  async delete(req, res) {
    try {
      await inventoryService.deleteItem(req.params.id);
      res.status(200).json({
        success: true,
        message: "Item deleted successfully",
      });
    } catch (error) {
      const statusCode = error.message === "Item not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/inventory/search?q=query
   * Search inventory items
   */
  async search(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const items = await inventoryService.searchItems(q);
      res.status(200).json({
        success: true,
        data: items,
        total: items.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/inventory/stats
   * Get dashboard analytics
   */
  async getStats(req, res) {
    try {
      const stats = await inventoryService.getStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/upload/image
   * Upload image only (for camera/gallery captures)
   */
  async uploadImage(req, res) {
    try {
      const imageData = await inventoryService.uploadImage(req.file);
      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: imageData,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /api/upload/image/:publicId
   * Delete image from Cloudinary
   */
  async deleteImage(req, res) {
    try {
      const result = await inventoryService.deleteImage(req.params.publicId);
      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  /**
   * POST /api/inventory/:id/sell
   * Process an item sale
   */
  async sell(req, res) {
    try {
      const item = await inventoryService.sellItem(
        req.params.id,
        req.body,
        req.file,
      );
      res.status(200).json({
        success: true,
        message: "Item sold successfully",
        data: item,
      });
    } catch (error) {
      const statusCode = error.message === "Item not found" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/inventory/:id/restock
   * Increase item quantity
   */
  async restock(req, res) {
    try {
      const item = await inventoryService.restockItem(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Item restocked successfully",
        data: item,
      });
    } catch (error) {
      const statusCode = error.message === "Item not found" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PATCH /api/inventory/:id/archive
   * Archive an item
   */
  async archive(req, res) {
    try {
      const item = await inventoryService.archiveItem(req.params.id);
      res.status(200).json({
        success: true,
        message: "Item archived successfully",
        data: item,
      });
    } catch (error) {
      const statusCode = error.message === "Item not found" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PATCH /api/inventory/:id/unarchive
   * Unarchive an item
   */
  async unarchive(req, res) {
    try {
      const item = await inventoryService.unarchiveItem(req.params.id);
      res.status(200).json({
        success: true,
        message: "Item unarchived successfully",
        data: item,
      });
    } catch (error) {
      const statusCode = error.message === "Item not found" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new InventoryController();
