const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * POST /
 * Public. Create a new order.
 * Accepts { customer_name, customer_phone, customer_address, items, total }
 * where items is an array of { id, name, price, quantity }.
 */
router.post('/', (req, res) => {
  try {
    const { customer_name, customer_phone, customer_address, items, total } = req.body;

    if (!customer_name || !customer_phone || !customer_address || !items || !total) {
      return res.status(400).json({ error: 'All fields are required: customer_name, customer_phone, customer_address, items, total.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array.' });
    }

    const items_json = JSON.stringify(items);

    const result = db.prepare(`
      INSERT INTO orders (customer_name, customer_phone, customer_address, items_json, total)
      VALUES (?, ?, ?, ?, ?)
    `).run(customer_name, customer_phone, customer_address, items_json, parseFloat(total));

    const created = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      id: created.id,
      customer_name: created.customer_name,
      customer_phone: created.customer_phone,
      customer_address: created.customer_address,
      items: JSON.parse(created.items_json),
      total: created.total,
      status: created.status,
      created_at: created.created_at,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

/**
 * GET /
 * Protected. Return all orders, most recent first.
 */
router.get('/', authMiddleware, (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();

    const parsed = orders.map((order) => ({
      ...order,
      items: JSON.parse(order.items_json),
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

/**
 * PUT /:id/status
 * Protected. Update order status.
 * Accepts { status } where status is one of: pending, confirmed, delivered, cancelled.
 */
router.put('/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);

    res.json({
      ...updated,
      items: JSON.parse(updated.items_json),
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

module.exports = router;
