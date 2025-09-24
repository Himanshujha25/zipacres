const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/addproperty");
const { protect, adminOnly } = require("../middleware/auth");

// Routes
// 🟢 Any logged-in user can view properties
router.get('/my', protect, propertyController.getMyProperties);
router.get("/", protect, propertyController.getAllProperties);
router.get("/:id", protect, propertyController.getPropertyById);

// 🔴 Only admins can add/update/delete
router.post("/", protect, adminOnly, propertyController.addProperty);
router.put("/:id", protect, adminOnly, propertyController.updateProperty);
router.delete("/:id", protect, adminOnly, propertyController.deleteProperty);


module.exports = router;
