const express = require("express");
const router = express.Router();
const { getLeads, updateLead,deleteLead } = require("../controllers/leads");
const { protect } = require("../middleware/auth");

router.get("/", protect, getLeads);
router.put("/:id", protect, updateLead);
router.delete("/delete", protect, deleteLead);


module.exports = router;
