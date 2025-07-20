const express = require("express");
const router = express.Router();
const catalogController = require("../controllers/catalogController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require('../middleware/upload');

//Search
router.get("/search", catalogController.searchCatalogs);

// Public routes
router.get("/", catalogController.getAllCatalogs);
router.get("/:id", catalogController.getCatalogById);

// Admin routes
router.post("/", adminMiddleware, upload.single('cover'), catalogController.createCatalog);
router.put("/:id", adminMiddleware, catalogController.updateCatalog);
router.delete("/:id", adminMiddleware, catalogController.deleteCatalog);

module.exports = router;
