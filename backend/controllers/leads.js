// controllers/lead.js
const User = require("../models/User");

// GET /api/leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await User.find({ role: "user" })
      .select("name email phoneNumber contacted note tags lastContactedAt")
      .sort({ createdAt: -1 });

    // Normalize phoneNumber to show "No phone" if empty
    const normalizedLeads = leads.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      phoneNumber: u.phoneNumber && u.phoneNumber.trim() !== "" ? u.phoneNumber : "No phone",
      contacted: u.contacted,
      note: u.note,
      tags: u.tags,
      lastContactedAt: u.lastContactedAt,
    }));

    res.json(normalizedLeads);
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
