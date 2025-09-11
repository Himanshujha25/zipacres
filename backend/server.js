const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// Connect to database
connectDB();

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS setup

app.use(cors({
  origin: ["https://zipacres.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));



// Routes
const propertyRoutes = require("./routes/property");
const leadRoutes = require("./routes/leads");
const authRoutes = require("./routes/auth");



app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
