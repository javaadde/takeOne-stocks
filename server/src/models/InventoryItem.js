const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: [true, "Model name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      enum: {
        values: [
          "Apple",
          "Samsung",
          "Google",
          "Xiaomi",
          "OnePlus",
          "Motorola",
          "Vivo",
          "Oppo",
          "iQOO",
          "Other",
        ],
        message: "{VALUE} is not a supported brand",
      },
    },
    imei: {
      type: String,
      trim: true,
      default: null,
    },
    purchasePrice: {
      type: Number,
      required: [true, "Purchase price is required"],
      min: [0, "Purchase price cannot be negative"],
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Selling price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 1,
    },
    minWholesalePrice: {
      type: Number,
      default: null,
    },
    minRetailPrice: {
      type: Number,
      default: null,
    },
    supplier: {
      type: String,
      trim: true,
      default: null,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["in_stock", "low", "out_of_stock"],
      default: "in_stock",
    },
    color: {
      type: String,
      trim: true,
      default: null,
    },
    image: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Auto-update status based on quantity
inventoryItemSchema.pre("save", function (next) {
  if (this.quantity === 0) {
    this.status = "out_of_stock";
  } else if (this.quantity <= 5) {
    this.status = "low";
  } else {
    this.status = "in_stock";
  }
  next();
});

// Index for search
inventoryItemSchema.index({ model: "text", brand: "text", supplier: "text" });
inventoryItemSchema.index({ brand: 1 });
inventoryItemSchema.index({ status: 1 });

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

module.exports = InventoryItem;
