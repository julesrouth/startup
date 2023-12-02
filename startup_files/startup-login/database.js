const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const habitsCollection = db.collection('habits');
const completedHabitsCollection = db.collection('completedHabits');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}


async function addHabit(habit) {
  //only add of not in database
  habitFind = await habitsCollection.findOne({name: habit.name}, (err, habit) => {
    if(err) throw err;
  });
  console.log(!!habitFind);
  if(!!habitFind){
    //const result = await habitsCollection.updateOne({name: habit.name}, {$set: {habit: habit.habit}});
    return habitFind;
  }
  else{
    const result = await habitsCollection.insertOne(habit);
    return result;
  }
}

async function updateHabit(habit) {
    const result = await habitsCollection.updateOne({name: habit.name}, {$set: {completed: habit.completed}});
    return result;
}

async function deleteHabit(habit){
    const result = await habitsCollection.deleteOne({name: habit.name});
    return result;  
}

async function getHabits(){
    const query = { habits: { $gt: 0, $lt: 900 } };
    const options = {
        sort: { habits: -1 },
        limit: 5,
    };
    //const cursor = habitsCollection.find(query, options);
    const cursor = habitsCollection.find();
    const result = await cursor.toArray();
    //result.forEach((i)=>console.log(i));
    return result;
}

async function addCompletedHabit(completedHabit) {
  //only add of not in database
  let completedHabitFind;
  completedHabitFind = await completedHabitsCollection.findOne({name: completedHabit.name}, (err, habit) => {
    if(err) throw err;
  });
  console.log(!!completedHabitFind);
  if(!!completedHabitFind){
    //const result = await completedHabitsCollection.updateOne({name: completedHabit.name}, {$set: {completedHabits: completedHabit.completedHabits}});
    return !!completedHabitFind;
  }
  else{
    const result = await completedHabitsCollection.insertOne(completedHabit);
    return result;
  }
}

async function getCompletedHabits() {
  const query = { completedHabits: { $gt: 0, $lt: 900 } };
  const options = {
    sort: { completedHabits: -1 },
    limit: 10,
  };
  const cursor = completedHabitsCollection.find();
  try{
    const result = await cursor.toArray();
    return result;
  
  }
  catch(error){
    console.log(error);
  
  }
}

async function clearHabits() {
  const result = await habitsCollection.deleteMany({});
  return result;
}

async function clearCompletedHabits() {
  const result = await completedHabitsCollection.deleteMany({});
  return result;
}

module.exports = { 
  addHabit, 
  updateHabit, 
  deleteHabit, 
  getHabits, 
  addCompletedHabit, 
  getCompletedHabits, 
  clearHabits, 
  clearCompletedHabits,
  getUser,
  getUserByToken,
  createUser, 
};