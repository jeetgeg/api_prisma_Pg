const router = require("express").Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.route("/").get(getCategories).post(createCategory);
router.route("/:id").put(updateCategory).delete(deleteCategory);

module.exports = router;
