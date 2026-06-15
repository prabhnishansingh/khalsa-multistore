const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'db.json');

// Initialize empty database if it doesn't exist
if (!fs.existsSync(dbPath)) {
  const initialData = {
    admins: [],
    products: [],
    orders: []
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
}

// Helper functions to load and save
function loadData() {
  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to read db.json:', err);
    return { admins: [], products: [], orders: [] };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

// Seed admin and sample products if needed
const seedData = loadData();
if (seedData.admins.length === 0) {
  const passwordHash = bcrypt.hashSync('khalsa@2024', 10);
  seedData.admins.push({
    id: 1,
    username: 'admin',
    password_hash: passwordHash,
    created_at: new Date().toISOString()
  });
  console.log('Default admin seeded in JSON db: username=admin');
}

if (seedData.products.length === 0) {
  const sampleProducts = [
    { id: 1, name: 'Basmati Rice 5kg', description: 'Premium long-grain basmati rice, perfect for biryani and pulao', price: 450, category: 'Groceries', image_url: '/placeholder.jpg', stock: 50, created_at: new Date().toISOString() },
    { id: 2, name: 'Toor Dal 1kg', description: 'High-quality toor dal for everyday cooking', price: 180, category: 'Groceries', image_url: '/placeholder.jpg', stock: 80, created_at: new Date().toISOString() },
    { id: 3, name: 'Amul Butter 500g', description: 'Creamy and delicious Amul butter', price: 280, category: 'Dairy & Beverages', image_url: '/placeholder.jpg', stock: 30, created_at: new Date().toISOString() },
    { id: 4, name: 'Amul Milk 1L', description: 'Fresh toned milk, pasteurized and homogenized', price: 65, category: 'Dairy & Beverages', image_url: '/placeholder.jpg', stock: 100, created_at: new Date().toISOString() },
    { id: 5, name: "Lay's Classic Chips", description: 'Crispy salted potato chips, party pack', price: 30, category: 'Snacks & Sweets', image_url: '/placeholder.jpg', stock: 120, created_at: new Date().toISOString() },
    { id: 6, name: "Haldiram's Namkeen 400g", description: 'Traditional Indian namkeen mix', price: 150, category: 'Snacks & Sweets', image_url: '/placeholder.jpg', stock: 60, created_at: new Date().toISOString() },
    { id: 7, name: 'Dove Soap 100g', description: 'Moisturizing beauty bar for soft skin', price: 55, category: 'Personal Care', image_url: '/placeholder.jpg', stock: 90, created_at: new Date().toISOString() },
    { id: 8, name: 'Colgate Toothpaste 200g', description: 'Strong teeth toothpaste with calcium boost', price: 120, category: 'Personal Care', image_url: '/placeholder.jpg', stock: 70, created_at: new Date().toISOString() },
    { id: 9, name: 'Surf Excel 1kg', description: 'Easy wash detergent powder for tough stains', price: 230, category: 'Household', image_url: '/placeholder.jpg', stock: 45, created_at: new Date().toISOString() },
    { id: 10, name: 'Vim Dishwash Bar', description: 'Powerful grease-cutting dishwash bar', price: 35, category: 'Household', image_url: '/placeholder.jpg', stock: 110, created_at: new Date().toISOString() },
    { id: 11, name: 'Classmate Notebook', description: 'Single-line ruled notebook, 200 pages', price: 45, category: 'Stationery', image_url: '/placeholder.jpg', stock: 150, created_at: new Date().toISOString() },
    { id: 12, name: 'Cello Pen Pack of 5', description: 'Smooth-writing blue ballpoint pens', price: 50, category: 'Stationery', image_url: '/placeholder.jpg', stock: 200, created_at: new Date().toISOString() }
  ];
  seedData.products = sampleProducts;
  console.log('12 sample products seeded in JSON db');
}
saveData(seedData);

// Mock better-sqlite3 API
const dbMock = {
  pragma: () => {},
  
  prepare: (sql) => {
    // Normalize SQL whitespace
    const cleanSql = sql.replace(/\s+/g, ' ').trim();
    
    return {
      all: (...params) => {
        const data = loadData();
        
        // 1. SELECT * FROM products WHERE category = ?
        if (cleanSql.includes('FROM products WHERE category = ?')) {
          const category = params[0];
          return data.products.filter(p => p.category === category);
        }
        
        // 2. SELECT * FROM products
        if (cleanSql === 'SELECT * FROM products') {
          return data.products;
        }
        
        // 3. SELECT * FROM orders ORDER BY created_at DESC
        if (cleanSql.includes('FROM orders ORDER BY created_at DESC') || cleanSql.includes('FROM orders')) {
          return [...data.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        
        return [];
      },
      
      get: (...params) => {
        const data = loadData();
        
        // 1. SELECT id FROM admins WHERE username = ?
        if (cleanSql.includes('FROM admins WHERE username = ?')) {
          const username = params[0];
          return data.admins.find(a => a.username === username);
        }
        
        // 2. SELECT COUNT(*) AS count FROM products
        if (cleanSql.includes('SELECT COUNT(*) AS count FROM products')) {
          return { count: data.products.length };
        }
        
        // 3. SELECT * FROM products WHERE id = ?
        if (cleanSql.includes('FROM products WHERE id = ?')) {
          const id = parseInt(params[0], 10);
          return data.products.find(p => p.id === id);
        }
        
        // 4. SELECT * FROM orders WHERE id = ?
        if (cleanSql.includes('FROM orders WHERE id = ?')) {
          const id = parseInt(params[0], 10);
          return data.orders.find(o => o.id === id);
        }

        return null;
      },
      
      run: (...params) => {
        const data = loadData();
        let changes = 0;
        let lastInsertRowid = null;
        
        // 1. INSERT INTO admins (username, password_hash) VALUES (?, ?)
        if (cleanSql.startsWith('INSERT INTO admins')) {
          const [username, password_hash] = params;
          const newId = data.admins.length > 0 ? Math.max(...data.admins.map(a => a.id)) + 1 : 1;
          data.admins.push({
            id: newId,
            username,
            password_hash,
            created_at: new Date().toISOString()
          });
          lastInsertRowid = newId;
          changes = 1;
        }
        
        // 2. INSERT INTO products (name, description, price, category, image_url, stock)
        else if (cleanSql.includes('INSERT INTO products')) {
          // Supporting both array params and named params (@name)
          let name, description, price, category, image_url, stock;
          
          if (params.length === 1 && typeof params[0] === 'object') {
            const p = params[0];
            name = p.name;
            description = p.description;
            price = p.price;
            category = p.category;
            image_url = p.image_url;
            stock = p.stock;
          } else {
            [name, description, price, category, image_url, stock] = params;
          }
          
          const newId = data.products.length > 0 ? Math.max(...data.products.map(p => p.id)) + 1 : 1;
          data.products.push({
            id: newId,
            name,
            description: description || null,
            price: parseFloat(price),
            category,
            image_url: image_url || '/placeholder.jpg',
            stock: parseInt(stock, 10) || 0,
            created_at: new Date().toISOString()
          });
          lastInsertRowid = newId;
          changes = 1;
        }
        
        // 3. UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ? WHERE id = ?
        // Or with image_url: UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ?, stock = ? WHERE id = ?
        else if (cleanSql.startsWith('UPDATE products')) {
          if (cleanSql.includes('image_url = ?')) {
            const [name, description, price, category, image_url, stock, id] = params;
            const idx = data.products.findIndex(p => p.id === parseInt(id, 10));
            if (idx !== -1) {
              data.products[idx] = {
                ...data.products[idx],
                name,
                description,
                price: parseFloat(price),
                category,
                image_url,
                stock: parseInt(stock, 10) || 0
              };
              changes = 1;
            }
          } else {
            const [name, description, price, category, stock, id] = params;
            const idx = data.products.findIndex(p => p.id === parseInt(id, 10));
            if (idx !== -1) {
              data.products[idx] = {
                ...data.products[idx],
                name,
                description,
                price: parseFloat(price),
                category,
                stock: parseInt(stock, 10) || 0
              };
              changes = 1;
            }
          }
        }
        
        // 4. DELETE FROM products WHERE id = ?
        else if (cleanSql.startsWith('DELETE FROM products')) {
          const id = parseInt(params[0], 10);
          const initialLength = data.products.length;
          data.products = data.products.filter(p => p.id !== id);
          if (data.products.length < initialLength) {
            changes = 1;
          }
        }
        
        // 5. INSERT INTO orders (customer_name, customer_phone, customer_address, items_json, total)
        else if (cleanSql.startsWith('INSERT INTO orders')) {
          const [customer_name, customer_phone, customer_address, items_json, total] = params;
          const newId = data.orders.length > 0 ? Math.max(...data.orders.map(o => o.id)) + 1 : 1;
          data.orders.push({
            id: newId,
            customer_name,
            customer_phone,
            customer_address,
            items_json,
            total: parseFloat(total),
            status: 'pending',
            created_at: new Date().toISOString()
          });
          lastInsertRowid = newId;
          changes = 1;
        }
        
        // 6. UPDATE orders SET status = ? WHERE id = ?
        else if (cleanSql.startsWith('UPDATE orders')) {
          const [status, id] = params;
          const idx = data.orders.findIndex(o => o.id === parseInt(id, 10));
          if (idx !== -1) {
            data.orders[idx].status = status;
            changes = 1;
          }
        }
        
        saveData(data);
        return { lastInsertRowid, changes };
      }
    };
  },
  
  transaction: (fn) => {
    return (...args) => {
      // JSON database read/write is synchronous, so transactions are automatically safe
      return fn(...args);
    };
  }
};

module.exports = dbMock;
