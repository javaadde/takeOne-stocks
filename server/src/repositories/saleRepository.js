const Sale = require("../models/Sale");

class SaleRepository {
  async create(saleData) {
    const sale = new Sale(saleData);
    return await sale.save();
  }

  async findAll() {
    return await Sale.find().populate("itemId").sort({ createdAt: -1 });
  }
}

module.exports = new SaleRepository();
