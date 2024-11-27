const express = require("express");
const dotnev = require("dotenv");
dotnev.config();

// route import
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");

const app = express();
app.use(express.json());

// Routes
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
