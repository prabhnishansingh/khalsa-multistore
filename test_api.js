const http = require('http');

function postJSON(path, data, token) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: headers
    }, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          if (res.statusCode >= 400) {
            reject(new Error(`Status ${res.statusCode}: ${json.error || json.message || responseBody}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${responseBody}`));
        }
      });
    });
    
    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('--- Testing API Endpoints ---');
  
  try {
    // 1. Login
    console.log('Testing Admin Login...');
    const loginRes = await postJSON('/api/auth/login', {
      username: 'admin',
      password: 'khalsa@2024'
    });
    console.log('Login Success! Token obtained.');
    const token = loginRes.token;
    
    // 2. Add Product (using application/json for test simplicity since products route accepts req.body fields parsed by multer, but let's check if products route handles JSON POST when no multer image is sent)
    // Wait, products route uses authMiddleware and upload.single('image') which handles both multipart and text fields. 
    // Let's see if we can do a multipart post or if JSON post works with multer. Multer only parses multipart requests, so a JSON post will have req.body empty unless express.json() is used. Since express.json() is used in server.js, req.body will be populated for JSON post if Content-Type is application/json!
    console.log('Testing Product Creation...');
    const productRes = await postJSON('/api/products', {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      category: 'Groceries',
      stock: 10
    }, token);
    console.log('Product Created successfully:', productRes);
    
    // 3. Place Order
    console.log('Testing Order Placement...');
    const orderRes = await postJSON('/api/orders', {
      customer_name: 'Test Customer',
      customer_phone: '1234567890',
      customer_address: '123 Test Street',
      items: [
        { id: productRes.id, name: productRes.name, price: productRes.price, quantity: 2 }
      ],
      total: 199.98
    });
    console.log('Order Placed successfully:', orderRes);
    
    console.log('--- All API Tests Succeeded! ---');
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

runTests();
