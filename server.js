const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, './.env') });

const mongoURI = process.env.REACT_APP_MONGO_KEY;
salts = process.env.REACT_APP_SALT_ROUNDS

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded image (you can customize this)
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

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
    unique: true,
    required: true, 
  },
  token: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  events: [
    {
      name: String,
      date: Date,
      description: String,
      imageFilename: String,
      completed: String,
    }
  ]
});
  
const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign({ username: username }, process.env.REACT_APP_JWT_KEY);

    // Create a new user in the database
    const newUser = new User({ username, token, password: hashedPassword, events: [] });

    await newUser.save();
    res.status(201).send('User registered successfully');
  } 
  catch (error) {
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

  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  // Check if the provided password matches the hashed password in MongoDB
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).send('Invalid credentials');
  }

  // Generate and send a JWT
  const token = user.token
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
    await user.deleteOne();

    res.status(200).send('Account deleted successfully');
  } catch (error) {
    res.status(500).send('Account deletion failed');
  }
});

app.post('/add-event', async (req, res) => {
  // Extract event data from the request body
  const { username, event } = req.body;

  const isoDateString = event.date;
  event.date = new Date(isoDateString);

  try {
    // Find the user by their username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if an event with the same name and date already exists
    const existingEvent = user.events.find(existingEvent => {
      return existingEvent.name === event.name &&
             existingEvent.date.toDateString() === event.date.toDateString();
    });

    // If an event with the same name and date exists, return an error response
    if (existingEvent) {
      return res.status(400).send('Event with the same name and date already exists');
    }

    // Append the new event to the user's events array
    user.events.push(event);

    // Save the updated user document
    await user.save();

    res.status(200).send('Event added to user successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to add event to user');
  }
});


app.post('/remove-event', async (req, res) => {
  // Extract event data from the request body
  const { username, eventName, eventDate } = req.body;

  // Convert the eventDate to a Date object
  const isoDateString = eventDate;
  const date = new Date(isoDateString);

  try {
    // Find the user by their username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find the index of the event to remove based on name and date
    const eventIndex = user.events.findIndex((event) => {
      return event.name === eventName && event.date.getTime() === date.getTime();
    });

    // If the event is found, remove it from the array
    if (eventIndex !== -1) {
      user.events.splice(eventIndex, 1);
    }

    // Save the updated user document
    await user.save();

    res.status(200).send('Event removed from user successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to remove event from user');
  }
});

app.get('/get-user-events', async (req, res) => {
  const { username, token } = req.query; // Assuming you send the username and token as query parameters

  try {
    // Find the user by their username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the provided token matches the stored token
    if (token !== user.token) {
      return res.status(401).send('Invalid token');
    }

    // Return the user's events as a JSON response
    res.status(200).json(user.events);
  } catch (error) {
    console.error(error);
    res.status(500).post('Failed to retrieve user events');
  }
});

app.get('/get-task/:username/:eventName/:eventDate', async (req, res) => {
  const { username, eventName, eventDate } = req.params;
  const { token } = req.query; // Assuming you send the token as a query parameter

  // Convert the eventDate to a Date object
  const isoDateString = eventDate;
  const date = new Date(isoDateString);

  try {
    // Find the user by their username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found' );
    }

    // Check if the provided token matches the stored token
    if (token !== user.token) {
      return res.status(401).send('Invalid token');
    }

    // Find the specific event based on name and date
    const task = user.events.find((event) => {
      return event.name === eventName && event.date.getTime() === date.getTime();
    });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    // Return the task as a JSON response
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to retrieve the task');
  }
});

app.put('/update-event', async (req, res) => {
  const { username, eventName, eventDate, completed } = req.body;

  try {
    // Find the user by their username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find the specific event based on name and date
    const eventToUpdate = user.events.find((event) => {
      console.log(event.name, eventName, event.date, eventDate)
      return event.name === eventName && event.date.toISOString() === eventDate;
    });

    if (!eventToUpdate) {
      return res.status(404).send('Event not found');
    }

    // Update the 'completed' value of the event
    eventToUpdate.completed = completed;

    // Save the updated user document
    await user.save();

    res.status(200).send('Event completed status updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to update event completed status');
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