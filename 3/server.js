const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
const jwtSecret = "supersecretkey";
// Connect to MongoDB
mongoose.connect('mongodb://localhost/microblog', { useNewUrlParser: true,
useUnifiedTopology: true })
 .then(() => console.log('Connected to MongoDB...'))
 .catch(err => console.error('Could not connect to MongoDB...', err));
// User Schema
const userSchema = new mongoose.Schema({
 username: { type: String, unique: true },
 password: String,
 followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
const User = mongoose.model('User', userSchema);
// Post Schema
const postSchema = new mongoose.Schema({
 content: String,
 user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
 date: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);
// Register user
app.post('/register', async (req, res) => {
 const { username, password } = req.body;
 const hashedPassword = await bcrypt.hash(password, 10);
 const user = new User({ username, password: hashedPassword });
 await user.save();
 res.json({ message: 'User registered successfully!' });
});
// Login user
app.post('/login', async (req, res) => {
 const { username, password } = req.body;
 const user = await User.findOne({ username });
 if (!user) return res.status(400).json({ message: 'Invalid username or password' });
 const isMatch = await bcrypt.compare(password, user.password);
 if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });
 const token = jwt.sign({ userId: user._id }, jwtSecret);
 res.json({ token, userId: user._id });
});
// Post content
app.post('/post', async (req, res) => {
 const { content, token } = req.body;
 const decoded = jwt.verify(token, jwtSecret);
 const post = new Post({
 content,
 user: decoded.userId
 });
 await post.save();
 res.json({ message: 'Post created successfully!' });
});
// Follow a user
app.post('/follow', async (req, res) => {
 const { token, followUserId } = req.body;
 const decoded = jwt.verify(token, jwtSecret);
 const user = await User.findById(decoded.userId);
 const followUser = await User.findById(followUserId);
 if (!user.following.includes(followUserId)) {
 user.following.push(followUserId);
 followUser.followers.push(user._id);
 }
 await user.save();
 await followUser.save();
 res.json({ message: `You are now following ${followUser.username}` });
});
// Fetch posts from people the user follows
app.get('/feed', async (req, res) => {
 const token = req.headers.authorization.split(' ')[1];
 const decoded = jwt.verify(token, jwtSecret);
 const user = await User.findById(decoded.userId).populate('following');
 const posts = await Post.find({ user: { $in: user.following } })
 .populate('user')
 .sort({ date: -1 });
 res.json(posts);
});
app.listen(3000, () => console.log('Server started on port 3000'));