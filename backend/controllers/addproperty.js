const Property = require("../models/Property");

// Create a new property (ONLY admins)
exports.addProperty = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can add properties",
      });
    }

    const {
      title,
      location,
      price,
      type,
      bedrooms,
      bathrooms,
      areaSqft,
      image,
      gallery,
      desc,
    } = req.body;

    if (!title || !location || !price || !type || !image) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });
    }

    const property = new Property({
      title,
      location,
      price,
      type,
      bedrooms,
      bathrooms,
      areaSqft,
      image,
      gallery,
      desc,
      ownerId: req.user._id,
    });

    await property.save();

    const populatedProperty = await property.populate(
      "ownerId",
      "name email phoneNumber"
    );

    res.status(201).json({
      success: true,
      message: "Property added successfully",
      property: populatedProperty,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch all properties
exports.getProperties = async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== "admin") {
      // Normal users → only show listed/public properties
      query = { status: "listed" };
    }
    // Admin → see everything (no filter)

    const properties = await Property.find(query).populate(
      "ownerId",
      "name email phoneNumber"
    );

    return res.status(200).json({ success: true, data: properties });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch properties created by logged-in admin
exports.getMyProperties = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view their own listings",
      });
    }

    const properties = await Property.find({ ownerId: req.user._id }).populate(
      "ownerId",
      "name email phoneNumber"
    );

    return res.status(200).json({ success: true, data: properties });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch single property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "ownerId",
      "name email phoneNumber"
    );
    if (!property)
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });

    res.json({ success: true, property });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Update property (ONLY the admin who owns it)
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });

    if (
      req.user.role !== "admin" ||
      property.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this property",
      });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("ownerId", "name email phoneNumber");

    res.json({ success: true, message: "Property updated", property: updated });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Delete property (ONLY the admin who owns it)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });

    if (
      req.user.role !== "admin" ||
      property.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this property",
      });
    }

    await property.deleteOne();

    res.json({ success: true, message: "Property deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
