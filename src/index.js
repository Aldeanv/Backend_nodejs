require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/uploads", express.static(path.join(__dirname, "../covers")));

app.use("/api/auth", authRoutes);
app.use("/api/catalogs", catalogRoutes);
app.use("/api/wishlists", wishlistRoutes);

app.get("/", (_, res) => res.send("Aksaraya backend aktif 🚀"));

const PORT = process.env.PORT || 5100;
app.listen(PORT, () =>
  console.log(`Server berjalan di http://localhost:${PORT}`)
);
