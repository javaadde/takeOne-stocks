const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerPhoto: {
      url: {
        type: String,
        required: [true, "Customer photo is required"],
      },
      publicId: {
        type: String,
      },
    },
    imei: {
      type: String,
      required: [true, "IMEI code is required"],
      trim: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    saleType: {
      type: String,
      enum: ["retail", "wholesale"],
      required: true,
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
