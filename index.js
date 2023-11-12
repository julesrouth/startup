const express = require('express');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Get Completed Habits
apiRouter.get('/completedHabits', (_req, res) => {
  res.send(habits);
});

// Submit Habit
apiRouter.post('/habit', (req, res) => {
  habits = updateHabits(req.body, habits);
  res.send(habits);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// update habits
let habits = [];
function updateHabits(newHabit, habits) {

  habits.push(newHabit);
  if (habits.length > 5) {
    habits.length = 5;
  }

  return habits;
}
