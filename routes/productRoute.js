const router = require("express").Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByCategoryId,
} = require("../controllers/productController");

router.route("/").get(getProducts).post(createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);
router.route("/category/:categoryId").get(getProductsByCategoryId);

module.exports = router;
