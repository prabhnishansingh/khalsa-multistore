const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ── Multer Configuration ───────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// ── Routes ─────────────────────────────────────────────────────────────────────

/**
 * GET /
 * List all products. Supports optional ?category=xxx query param for filtering.
 */
router.get('/', (req, res) => {
  try {
    const { category } = req.query;

    let products;
    if (category) {
      products = db.prepare('SELECT * FROM products WHERE category = ?').all(category);
    } else {
      products = db.prepare('SELECT * FROM products').all();
    }

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

/**
 * GET /:id
 * Get a single product by ID.
 */
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

/**
 * POST /
 * Protected. Create a new product with optional image upload.
 */
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required.' });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = db.prepare(`
      INSERT INTO products (name, description, price, category, image_url, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, description || null, parseFloat(price), category, image_url, parseInt(stock) || 0);

    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

/**
 * PUT /:id
 * Protected. Update an existing product. Supports new image upload.
 */
router.put('/:id', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const { name, description, price, category, stock } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : existing.image_url;

    db.prepare(`
      UPDATE products
      SET name = ?, description = ?, price = ?, category = ?, image_url = ?, stock = ?
      WHERE id = ?
    `).run(
      name || existing.name,
      description !== undefined ? description : existing.description,
      price ? parseFloat(price) : existing.price,
      category || existing.category,
      image_url,
      stock !== undefined ? parseInt(stock) : existing.stock,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

/**
 * DELETE /:id
 * Protected. Delete a product by ID.
 */
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

module.exports = router;
