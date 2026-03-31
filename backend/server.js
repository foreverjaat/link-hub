const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT ;


app.use(helmet());
app.use(cors({ origin:  "https://link-hub-snowy.vercel.app/" }));
app.use(express.json());
app.use(morgan("dev"));



app.use("/api/auth",    require("./routes/auth"));
app.use("/api/links",   require("./routes/links"));
app.use("/api/profile", require("./routes/profile"));



app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "LinkHub API is running" });
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// ─── Database + Server start 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" MongoDB connected");
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  });
