const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: 'SECRET_KEY_123456789',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Dummy user data (for demonstration purposes)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    console.log(req.session);
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username && user.password === password);

  if (user) {
    req.session.userId = user.id;
    return res.json({ message: 'Login successful', user });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Logout route
app.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logout successful' });
  });
});

// Protected route (requires authentication)
app.get('/dashboard', isAuthenticated, (req, res) => {
    console.log(req.session);
  return res.json({ message: 'Welcome to the dashboard!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
