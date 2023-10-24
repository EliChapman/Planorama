const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, './.env') });

const mongoURI = process.env.REACT_APP_MONGO_KEY;
salts = process.env.REACT_APP_SALT_ROUNDS

app.use(cors());
app.use(express.json());

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB Atlas');
})
.catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
});

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true, // Add this line to make the username field unique
      required: true, // Assuming you want the username to be required
    },
    password: {
      type: String,
      required: true, // Assuming you want the password to be required
    },
  });
  
const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    console.log('Received registration request:', req.body);
    const { username, password } = req.body;
  
    try {
         // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = new User({ username, password: hashedPassword });
  
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.username === 1) {
            // The error code 11000 indicates a duplicate key error (unique constraint violation)
            res.status(400).send('Username already exists');
        } else {
            res.status(500).send('Registration failed');
        }
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username in MongoDB
    const User = mongoose.model('User'); // Retrieve the User model
    const user = await User.findOne({ username });

    console.log(user.password)
  
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
  
    // Check if the provided password matches the hashed password in MongoDB
    console.log(password, user.password)
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (!passwordMatch) {
      return res.status(401).send('Invalid credentials');
    }
  
    // Generate and send a JWT
    const token = jwt.sign({ username: user.username }, process.env.REACT_APP_JWT_KEY);
    res.status(200).json({ token });
  });

app.post('/delete-account', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user by username in MongoDB
      const User = mongoose.model('User'); // Retrieve the User model
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Check if the provided password matches the hashed password in MongoDB
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).send('Invalid credentials');
      }
  
      // If the password matches, proceed to delete the user's account
      await user.remove(); // Assuming you have a Mongoose model with a remove method
  
      res.status(200).send('Account deleted successfully');
    } catch (error) {
      res.status(500).send('Account deletion failed');
    }
  });
  
  
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).send('Unauthorized');
    }
  
    jwt.verify(token, process.env.REACT_APP_JWT_KEY, (err, user) => {
      if (err) {
        return res.status(403).send('Invalid token');
      }
      req.user = user;
      next();
});
  }
  
app.get('/protected-route', authenticateToken, (req, res) => {
    // This route is protected and can only be accessed with a valid token
    res.json('Protected route accessed');
});

app.listen(8080, () => console.log('API is running on http://localhost:8080'));