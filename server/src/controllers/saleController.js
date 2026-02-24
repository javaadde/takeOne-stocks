const saleRepository = require("../repositories/saleRepository");

class SaleController {
  /**
   * GET /api/sales
   * Get all sales history with searching and sorting
   */
  async getAll(req, res) {
    try {
      const { search, sortBy, sortOrder } = req.query;

      let sales = await saleRepository.findAll();

      // Search filtering
      if (search) {
        const searchLower = search.toLowerCase();
        sales = sales.filter((sale) => {
          const item = sale.itemId;
          const brandMatch = item?.brand?.toLowerCase().includes(searchLower);
          const modelMatch = item?.model?.toLowerCase().includes(searchLower);
          const customerMatch = sale.customerName
            ?.toLowerCase()
            .includes(searchLower);
          const imeiMatch = sale.imei?.toLowerCase().includes(searchLower);

          return brandMatch || modelMatch || customerMatch || imeiMatch;
        });
      }

      // Sorting
      if (sortBy) {
        sales.sort((a, b) => {
          let valA, valB;

          if (sortBy === "date") {
            valA = new Date(a.createdAt);
            valB = new Date(b.createdAt);
          } else if (sortBy === "price") {
            valA = a.salePrice;
            valB = b.salePrice;
          } else if (sortBy === "customer") {
            valA = a.customerName.toLowerCase();
            valB = b.customerName.toLowerCase();
          } else if (sortBy === "brand") {
            valA = a.itemId?.brand?.toLowerCase() || "";
            valB = b.itemId?.brand?.toLowerCase() || "";
          } else {
            valA = a[sortBy];
            valB = b[sortBy];
          }

          if (valA < valB) return sortOrder === "desc" ? 1 : -1;
          if (valA > valB) return sortOrder === "desc" ? -1 : 1;
          return 0;
        });
      }

      res.status(200).json({
        success: true,
        data: sales,
        total: sales.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new SaleController();
