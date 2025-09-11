const express = require("express");
const router = express.Router();
const { getLeads, updateLead, deleteLead } = require("../controllers/leads");
const { protect } = require("../middleware/auth");

// GET all leads
router.get("/", protect, getLeads);

// UPDATE a lead
router.put("/:id", protect, updateLead);


module.exports = router;
