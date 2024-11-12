const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from "public" folder

// In-memory product store
let products = [];

// API to add a product
app.post('/api/products', (req, res) => {
  const { title, description, price, category, contact, date } = req.body;
  const product = { title, description, price, category, contact, date };
  products.push(product);
  res.status(201).json(product); // Send back the added product
});

// API to get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
