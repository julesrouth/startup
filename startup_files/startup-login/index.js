const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const Db = require('./database.js');

const authCookieName = 'token';

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);


/*END POINTS*/

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await Db.getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await Db.createUser(req.body.email, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await Db.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:email', async (req, res) => {
  const user = await DB.getUser(req.params.email);
  if (user) {
    const token = req?.cookies.token;
    res.send({ email: user.email, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await Db.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});


// Get Habits
apiRouter.get('/habits', async(_req, res) => {
  const habits = await Db.getHabits();
  res.send(habits);
});

// Get Completed Habits
apiRouter.get('/completedHabits', async(_req, res) => {
  const completedHabits = await Db.getCompletedHabits();
  res.send(completedHabits);
});

// Submit Habit
apiRouter.post('/habit', async(req, res) => {
  Db.addHabit(req.body);
  const habits = await Db.getHabits();
  res.send(habits);
});

//Update Habit
apiRouter.put('/habit/update', async(req , res) => {
  console.log("api update habit");
  Db.updateHabit(req.body);
  const habits = await Db.getHabits();
  res.send(habits);
});

//Delete Habit
apiRouter.delete('/habit', async(req, res) => {
  Db.deleteHabit(req.body);
  const habits = await Db.getHabits();
  res.send(habits);
});

// Submit Completed Habit
apiRouter.post('/completedHabit', async(req, res) => {
  Db.addCompletedHabit(req.body);
  const completedHabits = await Db.getCompletedHabits();
  res.send(completedHabits);
});

// clear habit database
apiRouter.delete('/habits', async(req, res) => {
  Db.clearHabits();
  const habits = await Db.getHabits();
  res.send(habits);
});

// clear completed habit database
apiRouter.delete('/completedHabits', async(req, res) => {
  Db.clearCompletedHabits();
  const completedHabits = await Db.getCompletedHabits();
  res.send(completedHabits);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
