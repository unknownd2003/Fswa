let token = '';
document.getElementById('registerBtn').addEventListener('click', async () => {
 const username = document.getElementById('regUsername').value;
 const password = document.getElementById('regPassword').value;
 const response = await fetch('/register', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ username, password })
 });
 const result = await response.json();
 alert(result.message);
});
document.getElementById('loginBtn').addEventListener('click', async () => {
 const username = document.getElementById('loginUsername').value;
 const password = document.getElementById('loginPassword').value;
 const response = await fetch('/login', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ username, password })
 });
 const result = await response.json();
 token = result.token;
 document.getElementById('auth').style.display = 'none';
 document.getElementById('app').style.display = 'block';
 fetchFeed();
});
document.getElementById('postBtn').addEventListener('click', async () => {
 const content = document.getElementById('postContent').value;
 await fetch('/post', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ content, token })
 });
 document.getElementById('postContent').value = '';
 fetchFeed();
});
async function fetchFeed() {
 const response = await fetch('/feed', {
 headers: { Authorization: `Bearer ${token}` }
 });
 const posts = await response.json();
 const feedDiv = document.getElementById('feed'); // Corrected ID
    
 feedDiv.innerHTML = ''; // Clear previous feed
 
 posts.forEach(post => {
     const postElement = document.createElement('div');
     postElement.classList.add('post');
     postElement.innerHTML = `
         <h4>${post.username}</h4>
         <p>${post.content}</p>
     `;
     feedDiv.appendChild(postElement);
 });
}