const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (await prisma.category.findUnique({ where: { name } })) {
      return res
        .status(409)
        .json({ error: `${name} Category is already Added.` });
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    parsedInt = parseInt(id, 10);
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const category = await prisma.category.findUnique({
      where: { id: parsedInt },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const categoryExist = await prisma.category.findUnique({ where: { name } });
    if (categoryExist) {
      return res
        .status(409)
        .json({ error: `${name} Category is already exists.` });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parsedInt },
      data: { name },
    });
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    parsedInt = parseInt(id, 10);
    if (!(await prisma.category.findUnique({ where: { id: parsedInt } }))) {
      return res.status(404).json({ error: "Category not found" });
    }

    const productCount = await prisma.product.count({
      where: { categoryId: parsedInt },
    });
    if (productCount) {
      return res
        .status(409)
        .json({
          error: `Category is being used in ${productCount} product(s). Cannot delete`,
        });
    }

    await prisma.category.delete({ where: { id: parsedInt } });
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
