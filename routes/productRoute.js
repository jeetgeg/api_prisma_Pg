const router = require("express").Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByCategoryId,
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/category/:categoryId", getProductsByCategoryId);

module.exports = router;
