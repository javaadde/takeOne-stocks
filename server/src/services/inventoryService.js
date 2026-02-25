const inventoryRepository = require("../repositories/inventoryRepository");
const cloudinary = require("../config/cloudinary");
const { uploadToCloudinary } = require("../middlewares/upload");
const saleRepository = require("../repositories/saleRepository");

class InventoryService {
  /**
   * Create a new inventory item (with optional image)
   */
  async createItem(data, file) {
    // Check if item already exists
    const existing = await inventoryRepository.findByBrandAndModel(
      data.brand,
      data.model,
    );
    if (existing) {
      const error = new Error("Item already exists in inventory");
      error.item = existing;
      throw error;
    }

    let imageData = { url: null, publicId: null };

    // If a file buffer was uploaded, stream it to Cloudinary
    if (file) {
      const result = await uploadToCloudinary(file.buffer);
      imageData = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    const itemData = {
      ...data,
      image: imageData,
      purchasePrice: Number(data.purchasePrice),
      sellingPrice: Number(data.sellingPrice),
      quantity: Number(data.quantity),
      minWholesalePrice: data.minWholesalePrice
        ? Number(data.minWholesalePrice)
        : null,
      minRetailPrice: data.minRetailPrice ? Number(data.minRetailPrice) : null,
    };

    return await inventoryRepository.create(itemData);
  }

  /**
   * Get all items with filters and pagination
   */
  async getAllItems(filters, options) {
    return await inventoryRepository.findAll(filters, options);
  }

  /**
   * Get single item by ID
   */
  async getItemById(id) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw new Error("Item not found");
    }
    return item;
  }

  /**
   * Update an existing item (with optional new image)
   */
  async updateItem(id, data, file) {
    const existingItem = await inventoryRepository.findById(id);
    if (!existingItem) {
      throw new Error("Item not found");
    }

    // If a new image was uploaded, delete the old one from Cloudinary
    if (file) {
      if (existingItem.image?.publicId) {
        await cloudinary.uploader.destroy(existingItem.image.publicId);
      }
      const result = await uploadToCloudinary(file.buffer);
      data.image = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    // Convert numeric strings to numbers
    if (data.purchasePrice) data.purchasePrice = Number(data.purchasePrice);
    if (data.sellingPrice) data.sellingPrice = Number(data.sellingPrice);
    if (data.quantity !== undefined) data.quantity = Number(data.quantity);
    if (data.minWholesalePrice !== undefined)
      data.minWholesalePrice = data.minWholesalePrice
        ? Number(data.minWholesalePrice)
        : null;
    if (data.minRetailPrice !== undefined)
      data.minRetailPrice = data.minRetailPrice
        ? Number(data.minRetailPrice)
        : null;

    // Auto-update status based on quantity
    if (data.quantity !== undefined) {
      if (data.quantity === 0) {
        data.status = "out_of_stock";
      } else if (data.quantity <= 5) {
        data.status = "low";
      } else {
        data.status = "in_stock";
      }
    }

    return await inventoryRepository.update(id, data);
  }

  /**
   * Delete an item and its Cloudinary image
   */
  async deleteItem(id) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw new Error("Item not found");
    }

    // Delete image from Cloudinary if it exists
    if (item.image?.publicId) {
      await cloudinary.uploader.destroy(item.image.publicId);
    }

    return await inventoryRepository.delete(id);
  }

  /**
   * Search inventory
   */
  async searchItems(query) {
    return await inventoryRepository.search(query);
  }

  /**
   * Get dashboard statistics
   */
  async getStats() {
    return await inventoryRepository.getStats();
  }

  /**
   * Upload image only (for camera/gallery capture scenarios)
   */
  async uploadImage(file) {
    if (!file) {
      throw new Error("No file provided");
    }

    const result = await uploadToCloudinary(file.buffer);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId) {
    if (!publicId) {
      throw new Error("No public ID provided");
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  }

  /**
   * Process a sale with pricing rules
   */
  async sellItem(id, saleData, file) {
    const item = await inventoryRepository.findById(id);
    if (!item) throw new Error("Item not found");

    const { salePrice, saleType, customerName, imei } = saleData; // saleType: 'wholesale' | 'retail'
    const purchasePrice = item.purchasePrice;

    // Validate required fields
    if (!customerName) throw new Error("Customer name is required");
    if (!imei) throw new Error("IMEI code is required");
    if (!file) throw new Error("Customer photo is required");

    if (saleType === "wholesale") {
      const minPrice = item.minWholesalePrice || purchasePrice + 500;
      if (Number(salePrice) < minPrice) {
        throw new Error(`Wholesale price must be at least ₹${minPrice}`);
      }
    } else if (saleType === "retail") {
      const minPrice = item.minRetailPrice || purchasePrice + 1000;
      if (Number(salePrice) < minPrice) {
        throw new Error(`Retail price must be at least ₹${minPrice}`);
      }
    } else {
      throw new Error("Invalid sale type");
    }

    // Upload customer photo to Cloudinary
    const uploadResult = await uploadToCloudinary(file.buffer);
    const customerPhoto = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };

    // Create sale record
    await saleRepository.create({
      itemId: id,
      customerName,
      customerPhoto,
      imei,
      salePrice: Number(salePrice),
      saleType,
    });

    return await inventoryRepository.sell(id);
  }

  /**
   * Restock an item
   */
  async restockItem(id, data) {
    const { quantityToAdd } = data;
    if (!quantityToAdd || quantityToAdd <= 0) {
      throw new Error("Quantity to add must be greater than 0");
    }
    return await inventoryRepository.restock(id, quantityToAdd);
  }

  /**
   * Archive an item
   */
  async archiveItem(id) {
    const item = await inventoryRepository.findById(id);
    if (!item) throw new Error("Item not found");
    return await inventoryRepository.archive(id);
  }

  /**
   * Unarchive an item
   */
  async unarchiveItem(id) {
    const item = await inventoryRepository.findById(id);
    if (!item) throw new Error("Item not found");
    return await inventoryRepository.unarchive(id);
  }
}

module.exports = new InventoryService();
