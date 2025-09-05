const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();
connectDB();

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));    


// ✅ CORS setup
app.use(cors({
  origin: "http://localhost:5173" || "https://zipacres.vercel.app/", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));

// Import Routes
const propertyRoutes = require("./routes/property");
const authRoutes = require("./routes/auth");  

// Use Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);  

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
