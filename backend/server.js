require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

/* ---------- MongoDB ---------- */
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) =>
    console.error("Failed to connect to MongoDB:", err)
  );

/* ---------- Middlewares ---------- */
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Routes ---------- */
const companyRoutes = require("./routes/companyRoutes");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

/* ---------- Test Route ---------- */
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from backend" });
});

/* ---------- API Routes ---------- */
app.use("/api", authRoutes);
app.use("/api", studentRoutes);
app.use("/api", companyRoutes);
app.use("/api", adminRoutes);

/* ---------- Static uploads (IMPORTANT) ---------- */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ---------- Server ---------- */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
