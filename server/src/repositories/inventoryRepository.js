const InventoryItem = require("../models/InventoryItem");

class InventoryRepository {
  /**
   * Create a new inventory item
   */
  async create(data) {
    const item = new InventoryItem(data);
    return await item.save();
  }

  /**
   * Find all inventory items with optional filters
   */
  async findAll(filters = {}, options = {}) {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const query = this._buildQuery(filters);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      InventoryItem.find(query)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(Number(limit)),
      InventoryItem.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find a single item by ID
   */
  async findById(id) {
    return await InventoryItem.findById(id);
  }

  /**
   * Update an item by ID
   */
  async update(id, data) {
    return await InventoryItem.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete an item by ID
   */
  async delete(id) {
    return await InventoryItem.findByIdAndDelete(id);
  }

  /**
   * Search items by text query
   */
  async search(query) {
    return await InventoryItem.find({
      $or: [
        { model: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { supplier: { $regex: query, $options: "i" } },
      ],
    });
  }

  /**
   * Get inventory statistics / analytics
   */
  async getStats() {
    const [totalItems, brandStats, statusStats, priceStats, monthlyAdditions] =
      await Promise.all([
        InventoryItem.countDocuments(),
        InventoryItem.aggregate([
          {
            $group: {
              _id: "$brand",
              count: { $sum: 1 },
              totalQuantity: { $sum: "$quantity" },
              avgSellingPrice: { $avg: "$sellingPrice" },
            },
          },
          { $sort: { totalQuantity: -1 } },
        ]),
        InventoryItem.aggregate([
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
              totalQuantity: { $sum: "$quantity" },
            },
          },
        ]),
        InventoryItem.aggregate([
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: "$quantity" },
              totalPurchaseValue: {
                $sum: { $multiply: ["$purchasePrice", "$quantity"] },
              },
              totalSellingValue: {
                $sum: { $multiply: ["$sellingPrice", "$quantity"] },
              },
              avgPurchasePrice: { $avg: "$purchasePrice" },
              avgSellingPrice: { $avg: "$sellingPrice" },
            },
          },
        ]),
        InventoryItem.aggregate([
          {
            $group: {
              _id: { $month: "$purchaseDate" },
              count: { $sum: "$quantity" },
              value: { $sum: { $multiply: ["$purchasePrice", "$quantity"] } },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    // Find best selling (highest quantity)
    const bestSelling = await InventoryItem.findOne()
      .sort({ quantity: -1 })
      .select("model brand quantity");

    return {
      totalItems,
      totalQuantity: priceStats[0]?.totalQuantity || 0,
      totalPurchaseValue: priceStats[0]?.totalPurchaseValue || 0,
      totalSellingValue: priceStats[0]?.totalSellingValue || 0,
      potentialProfit:
        (priceStats[0]?.totalSellingValue || 0) -
        (priceStats[0]?.totalPurchaseValue || 0),
      avgPurchasePrice: Math.round(priceStats[0]?.avgPurchasePrice || 0),
      avgSellingPrice: Math.round(priceStats[0]?.avgSellingPrice || 0),
      brandDistribution: brandStats,
      statusDistribution: statusStats,
      monthlyTrends: monthlyAdditions,
      bestSelling: bestSelling || null,
    };
  }

  /**
   * Sell an item (decrement quantity by 1)
   */
  async sell(id) {
    const item = await InventoryItem.findById(id);
    if (!item) throw new Error("Item not found");
    if (item.quantity <= 0) throw new Error("Item out of stock");

    item.quantity -= 1;

    // Auto-update status
    if (item.quantity === 0) {
      item.status = "out_of_stock";
    } else if (item.quantity <= 5) {
      item.status = "low";
    } else {
      item.status = "in_stock";
    }

    return await item.save();
  }

  /**
   * Restock an item (increment quantity)
   */
  async restock(id, quantityToAdd) {
    const item = await InventoryItem.findById(id);
    if (!item) throw new Error("Item not found");

    item.quantity += Number(quantityToAdd);

    // Auto-update status
    if (item.quantity === 0) {
      item.status = "out_of_stock";
    } else if (item.quantity <= 5) {
      item.status = "low";
    } else {
      item.status = "in_stock";
    }

    return await item.save();
  }

  /**
   * Find an item by brand and model
   */
  async findByBrandAndModel(brand, model) {
    return await InventoryItem.findOne({
      brand: { $regex: new RegExp(`^${brand}$`, "i") },
      model: { $regex: new RegExp(`^${model}$`, "i") },
    });
  }

  /**
   * Build MongoDB query from filter object
   */
  _buildQuery(filters) {
    const query = {};

    if (filters.brand && filters.brand !== "All") {
      query.brand = filters.brand;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      query.$or = [
        { model: { $regex: filters.search, $options: "i" } },
        { brand: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.minPrice) {
      query.sellingPrice = {
        ...query.sellingPrice,
        $gte: Number(filters.minPrice),
      };
    }

    if (filters.maxPrice) {
      query.sellingPrice = {
        ...query.sellingPrice,
        $lte: Number(filters.maxPrice),
      };
    }

    return query;
  }
}

module.exports = new InventoryRepository();
