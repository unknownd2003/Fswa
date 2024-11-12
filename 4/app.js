let selectedRestaurant = null;
let cart = [];
// Fetch and display restaurants
async function fetchRestaurants() {
 const response = await fetch('/restaurants');
 const restaurants = await response.json();
 const restaurantList = document.getElementById('restaurantList');
 restaurantList.innerHTML = `<h2>Select a Restaurant</h2>`;
 restaurants.forEach(restaurant => {
 const div = document.createElement('div');
 div.innerHTML = `
 <button onclick="selectRestaurant('${restaurant.name}')">${restaurant.name}</button>
 `;
 restaurantList.appendChild(div);
 });
}
// Select a restaurant and display its food items
async function selectRestaurant(name) {
 selectedRestaurant = name;
 const response = await fetch('/restaurants');
 const restaurants = await response.json();
 const restaurant = restaurants.find(r => r.name === name);
 const foodItemsDiv = document.getElementById('foodItems');
 const menuDiv = document.getElementById('menu');
 const restaurantName = document.getElementById('restaurantName');
 foodItemsDiv.style.display = 'block';
 restaurantName.innerHTML = name;
 menuDiv.innerHTML = '';
 restaurant.foodItems.forEach(item => {
 const itemDiv = document.createElement('div');
 itemDiv.innerHTML = `
 <span>${item.name} - $${item.price}</span>
 <input type="number" min="1" value="1" id="quantity_${item.name}">
 <button onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
 `;
 menuDiv.appendChild(itemDiv);
 });
}
function addToCart(name, price) {
 const quantity = document.getElementById(`quantity_${name}`).value;
 cart.push({ name, price, quantity: parseInt(quantity) });
 alert(`${name} added to cart`);
}
function viewCart() {
 const cartDiv = document.getElementById('cart');
 const cartItemsDiv = document.getElementById('cartItems');
 cartDiv.style.display = 'block';
 cartItemsDiv.innerHTML = '';
 cart.forEach(item => {
 const itemDiv = document.createElement('div');
 itemDiv.innerHTML = `<span>${item.name} x${item.quantity} - $${item.price *
item.quantity}</span>`;
 cartItemsDiv.appendChild(itemDiv);
 });
}
async function placeOrder() {
 const userName = document.getElementById('userName').value;
 const response = await fetch('/order', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 userName,
 restaurantName: selectedRestaurant,
 foodItems: cart
 })
 });
 const result = await response.json();
 alert(result.message);
 cart = [];
 document.getElementById('cart').style.display = 'none';
}
fetchRestaurants();