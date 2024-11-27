const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: { select: { id: true, name: true } } },
      omit: { categoryId: true, updatedAt: true },
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;
    if (!name) {
      return res.status(422).json({ error: "Name is required" });
    }
    if (!price) {
      return res.status(422).json({ error: "Price is required" });
    } else {
      if (typeof price !== "number" || price < 0) {
        return res
          .status(422)
          .json({ error: "Price must be a non-negative number" });
      }
    }

    if (!categoryId) {
      return res.status(422).json({ error: "Category is required" });
    } else {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
      });
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    const newProduct = await prisma.product.create({
      data: req.body,
      include: { category: { select: { id: true, name: true } } },
      omit: { categoryId: true, updatedAt: true },
    });
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: { select: { id: true, name: true } } },
      omit: { categoryId: true, updatedAt: true },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId } = req.body;

    parsedInt = parseInt(id, 10);
    if (name != undefined && name.trim() === "") {
      return res.status(422).json({ error: "Name is required" });
    }
    if (price != undefined && (typeof price !== "number" || price < 0)) {
      return res
        .status(422)
        .json({ error: "Price is required & must be a non-negative number" });
    }

    if (
      categoryId != undefined &&
      !(await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
      }))
    ) {
      return res.status(404).json({ error: "Category not found" });
    }

    // const product = await prisma.product.findUnique({
    //   where: { id: parsedInt },
    // });
    // if (!product) {
    //   return res.status(404).json({ error: "Product not found" });
    // }

    const updatedProduct = await prisma.product.update({
      where: { id: parsedInt },
      data: req.body,
      include: { category: { select: { id: true, name: true } } },
      omit: { categoryId: true, createdAt: true },
    });
    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Product you are trying to update. Does not exist." });
    }
    return res.status(500).json({ error: error.message });
  }
};

// delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    parsedInt = parseInt(id, 10);
    const product = await prisma.product.findUnique({
      where: { id: parsedInt },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await prisma.product.delete({ where: { id: parsedInt } });
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get products by category
exports.getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId: id } = req.params;
    // check category exist
    if (!(await prisma.category.findUnique({ where: { id: parseInt(id) } }))) {
      return res.status(404).json({ error: "Category not found" });
    }

    // get products by category
    const products = await prisma.product.findMany({
      where: { categoryId: parseInt(id) },
      include: { category: { select: { id: true, name: true } } },
      omit: { categoryId: true, updatedAt: true },
      orderBy: { name: "asc" },
    });
    if (products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
