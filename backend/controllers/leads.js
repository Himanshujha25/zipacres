// controllers/lead.js
const User = require("../models/User");

// GET /api/leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await User.find({ role: "user" }); // get all users
    res.json(leads); // send all fields as-is
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching leads" });
  }
};

// PUT /api/leads/:id
exports.updateLead = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body, // just update whatever is sent
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Lead not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating lead" });
  }
};
