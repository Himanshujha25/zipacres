const mongoose = require("mongoose");
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  type: { 
    type: String, 
    enum: [
      "Apartment", 
      "Plot", 
      "Villa", 
      "Penthouse", 
      "Studio", 
      "Independent House", 
      "Farmhouse", 
      "Duplex", 
      "Builder Floor"
    ], 
    required: true 
  },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  areaSqft: { type: Number },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  desc: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["listed", "unlisted"], 
    default: "listed" 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Property", propertySchema);
