// controllers/lead.js
const User = require("../models/User");

// GET /api/leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await User.find({ role: "user" })
      .select("name email phoneNumber contacted note tags lastContactedAt") // <- use phoneNumber
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching leads" });
  }
};

// PUT /api/leads/:id
exports.updateLead = async (req, res) => {
  try {
    const { contacted, note, tags, lastContactedAt } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { contacted, note, tags, lastContactedAt },
      { new: true }
    ).select("name email phoneNumber contacted note tags lastContactedAt");

    if (!updated) return res.status(404).json({ message: "Lead not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating lead" });
  }
};

// DELETE /api/leads/:id
exports.deleteLead = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting lead" });
  }
};
