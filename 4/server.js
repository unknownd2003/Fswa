const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
// Connect to MongoDB
mongoose.connect('mongodb://localhost/food_delivery', { useNewUrlParser: true,
useUnifiedTopology: true })
 .then(() => console.log('Connected to MongoDB...'))
 .catch(err => console.error('Could not connect to MongoDB...', err));
// Restaurant Schema
const restaurantSchema = new mongoose.Schema({
 name: String,
 foodItems: [{ name: String, price: Number }]
});
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
// Order Schema
const orderSchema = new mongoose.Schema({
 userName: String,
 restaurantName: String,
 foodItems: [{ name: String, quantity: Number, price: Number }],
 totalPrice: Number
});
const Order = mongoose.model('Order', orderSchema);
// Fetch all restaurants
app.get('/restaurants', async (req, res) => {
 const restaurants = await Restaurant.find();
 res.json(restaurants);
});
// Place an order
app.post('/order', async (req, res) => {
 const { userName, restaurantName, foodItems } = req.body;
 // Calculate total price
 let totalPrice = foodItems.reduce((total, item) => total + (item.price * item.quantity), 0);
 const order = new Order({
 userName,
 restaurantName,
 foodItems,
 totalPrice
 });
 await order.save();
 res.json({ message: "Order placed successfully!", order });
});
app.listen(3000, () => console.log('Server started on port 3000'));