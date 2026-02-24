require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/database");
const errorHandler = require("./middlewares/errorHandler");

// Import Routes
const inventoryRoutes = require("./routes/inventoryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const saleRoutes = require("./routes/saleRoutes");

// Initialize Express
const app = express();

// ========================
// Middleware
// ========================
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// ========================
// Routes
// ========================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TakeOne API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use("/api/inventory", inventoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/sales", saleRoutes);

// ========================
// 404 Handler
// ========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ========================
// Error Handler
// ========================
app.use(errorHandler);

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║                                          ║
    ║   🚀 TakeOne API Server                  ║
    ║                                          ║
    ║   Port:    ${PORT}                          ║
    ║   Env:     ${process.env.NODE_ENV || "development"}                  ║
    ║   Health:  http://localhost:${PORT}/api/health ║
    ║                                          ║
    ╚══════════════════════════════════════════╝
    `);
  });
});

module.exports = app;
