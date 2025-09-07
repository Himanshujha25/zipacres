const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();
connectDB();

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));    


const allowedOrigins = ["https://zipacres.vercel.app", "http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow tools like curl
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  credentials: true
}));


// Import Routes
const propertyRoutes = require("./routes/property");
const authRoutes = require("./routes/auth");  

// Use Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);  

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
