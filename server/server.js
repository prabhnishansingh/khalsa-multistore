const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// ── Create uploads directory if it doesn't exist ───────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// ── Middleware ──────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Serve static files from uploads directory ──────────────────────────────────
app.use('/uploads', express.static(uploadsDir));

// ── Import Routes ──────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// ── Mount Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'K minutes', whatsapp: '9040934485' });
});

// ── Start Server ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`K minutes API running on port ${PORT}`);
});
