const HabitCompletedEvent = 'habit-completed';
configureWebSocket();

async function getHabitsCollection(){
    let habits = [];
    var habitsText = "";
    try{
        console.log("trying to fetch habits");
        const response = await fetch('/api/habits', {
            method: 'GET',
        });
        habits = response.json();
        localStorage.setItem('habits', JSON.stringify(habits));
    }
    catch{
        console.log("fetch failed, loading from local storage");
        habitsText = localStorage.getItem('habits');
        if(habitsText){
            habits = JSON.parse(habitsText);
        }
    }
    console.log(habits);
    return habits
}

async function getCompletedHabitsCollection(){
    let completedHabits = [];
    var completedHabitsText = "";
    try{
        const response = await fetch('/api/completedHabits');      
        completedHabits = await response.json();
        localStorage.setItem('completedHabits', JSON.stringify(completedHabits));
    }
    catch{
        completedHabitsText = localStorage.getItem('completedHabits');
        if(completedHabitsText){
            completedHabits = JSON.parse(completedHabitsText);
        }
    }
    return completedHabits;

}

async function newHabit(){
    console.log("new habit");
    var habitName = document.getElementById("habitName").value;
    var habitFrequency = document.getElementById("habitFrequency").value;
    var userName = localStorage.getItem("userName");
    console.log(userName);

    const habit = { name: habitName, frequency: habitFrequency, completed: "0", user: userName }; //incFrequency: (x) => {this.frequency += x}
    console.log(habit);

    try{
        const response = await fetch('/api/habit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(habit),
        });
        const habits = await response.json();
        localStorage.setItem('habits', JSON.stringify(habits));
    } catch{
        newHabitLocal(habit);
    }
    window.location.href = "habits.html";
}

function newHabitLocal(habit){
    let habits = [];

    const habitsText = localStorage.getItem('habits');
    console.log(habitsText);
    
    if(habitsText){
        console.log("parsing habitsText");
        habits = JSON.parse(habitsText);
    }

    console.log(habits);
    
    if(habits.length < 6){
        habits.push(habit);
    
        console.log(habits);
        //might need have to add to local storage here
        console.log(JSON.stringify(habits));
        localStorage.setItem('habits', JSON.stringify(habits));
    }
    else{
        console.log("too many habits");
    }
}

async function newCompletedHabit(habit){
    console.log("adding new completed habit");

    let userName = localStorage.getItem('userName');
    let completedHabit = { userName: userName, name: habit.name, frequency: habit.frequency, completed: habit.completed, date: new Date().toLocaleDateString() };
    
    //remove habit from habits database

    try{
        const response = await fetch('/api/habit', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(habit),
        });
        const habits = await response.json();
        localStorage.setItem('habits', JSON.stringify(habits));
    } catch{
        let habits = getHabitsCollection();
        habits.splice(habit, 1);
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    //add new completed habit to completed habits database
    try{
        const response = await fetch('/api/completedHabit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(completedHabit),
        });
        let completedHabits = await response.json();
        localStorage.setItem('completedHabits', JSON.stringify(completedHabits));
    } catch{
        newCompletedHabitLocal(completedHabit);
    }
    //let other users know of a completed habit
    broadcastEvent(completedHabit.userName, HabitCompletedEvent, completedHabit);


}

function newCompletedHabitLocal(completedHabit){
    let completedHabits = [];

    const completedHabitsText = localStorage.getItem('completedHabits');
    console.log(completedHabitsText);
    
    if(completedHabitsText){
        console.log("parsing completedHabitsText");
        completedHabits = JSON.parse(completedHabitsText);
    }

    console.log(completedHabits);
    
    completedHabits.push(completedHabit);

    localStorage.setItem('completedHabits', JSON.stringify(completedHabits));
}

async function incFrequency(habitName){
    console.log("increasing frequency");

    let habits = [];
    habits = await getHabitsCollection();

    for(var habit in habits){
        if(habits[habit].name == habitName){
            console.log("found habit");
            if(habits[habit].completed < habits[habit].frequency){
                //inc habit
                habits[habit].completed++;
                //set it to a local variable so the fetch can work
                let incHabit = habits[habit];
                console.log(habits[habit].completed);
                if(habits[habit].completed == habits[habit].frequency){
                    console.log("habit completed");
                    let completedHabits = await newCompletedHabit(habits[habit]);
                    localStorage.setItem('completedHabits', JSON.stringify(completedHabits));
                    window.location.href = "habits.html";
                }
                else{
                    //update habit in database
                    try{
                        const response = await fetch('/api/habit/update', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(incHabit),
                        });
                        let habitsUpdated = await response.json();
                        localStorage.setItem('habits', JSON.stringify(habitsUpdated));
                    } catch(error){
                        console.log(error);
                        incFrequencyLocal(habits[habit], habits);
                    }
                    window.location.href = "habits.html";
                }
            }
        }
    }

}

function incFrequencyLocal(habit, habits){
    habits.push(habit);
    localStorage.setItem('habits', JSON.stringify(habits));
}


async function loadHabits(){
    console.log("loading habits");
    habits = await getHabitsCollection();
    
    for(var habit in habits){
        console.log(habit);
        console.log(habits[habit].user)
        addHabitToWeek(habits[habit].name, habits[habit].frequency, habits[habit].completed);
    }

}

function addHabitToWeek(habitName, habitFrequency, habitCompleted){
    console.log("habit Name: " + habitName + " habit Frequency: " + habitFrequency);
    if(localStorage.getItem("habits") != []){
        const tableBodyEl = document.querySelector('#habits');
        const nameTdEl = document.createElement('td');
        const sunTdEl = document.createElement('td');
        const monTdEl = document.createElement('td');
        const tuesTdEl = document.createElement('td');
        const wedTdEl = document.createElement('td');
        const thursTdEl = document.createElement('td');
        const friTdEl = document.createElement('td');
        const satTdEl = document.createElement('td');
        const frequencyTdEl = document.createElement('td');
        const meterTdEl = document.createElement('td');

        nameTdEl.textContent = habitName;
        sunTdEl.innerHTML = '<input type="button" value="+" onclick="incFrequency(\'' + habitName + '\')">';
        monTdEl.innerHTML = '<input type="button" value="+" onclick="incFrequency(\'' + habitName + '\')">';
        tuesTdEl.innerHTML = '<input type="button" value="+" onclick="incFrequency(\'' + habitName + '\')">';
        wedTdEl.innerHTML = '<input type="button" value="+" onclick="incFrequency(\'' + habitName + '\')">';
        thursTdEl.innerHTML = '<input type="button" value="+" onclick="incFrequency(\'' + habitName + '\')">';
        friTdEl.innerHTML = '<input type="button" value="+" onclick="incFrequency(\'' + habitName + '\')">';
        satTdEl.innerHTML = '<input type="button" value="+" onclick="incFrequency(\'' + habitName + '\')">';
        frequencyTdEl.textContent = habitCompleted + "/" + habitFrequency;

        const rowEl = document.createElement('tr');
        rowEl.appendChild(nameTdEl);
        rowEl.appendChild(sunTdEl);
        rowEl.appendChild(monTdEl);
        rowEl.appendChild(tuesTdEl);
        rowEl.appendChild(wedTdEl);
        rowEl.appendChild(thursTdEl);
        rowEl.appendChild(friTdEl);
        rowEl.appendChild(satTdEl);
        rowEl.appendChild(frequencyTdEl);
        rowEl.appendChild(meterTdEl);

        tableBodyEl.appendChild(rowEl);
    }
    else{
        console.log("no habits");
    }
    
}

function clearHabits(){
    console.log("clearing habits");

    try{
        const response = fetch('/api/habits', {
            method: 'DELETE',
        });
        const habits = response.json();
        localStorage.setItem('habits', JSON.stringify(habits));
    }
    catch{
        localStorage.setItem('habits', JSON.stringify([]));
    }
    window.location.href = "habits.html";
}

async function loadCompletedHabits(){
    let completedHabits = await getCompletedHabitsCollection();

    for(var habit in completedHabits){
        console.log(habit);
        addHabitToGallery(completedHabits[habit].userName, completedHabits[habit].name, completedHabits[habit].frequency, completedHabits[habit].completed, completedHabits[habit].date);
    } 
}

function addHabitToGallery(userName, habitName, habitFrequency, habitCompleted, habitDate){
    console.log("habit Name: " + habitName + " habit Frequency: " + habitFrequency);
    if(localStorage.getItem("completedHabits") != []){
        const tableBodyEl = document.querySelector('#completedHabits');
        const userNameTdEl = document.createElement('td');
        const nameTdEl = document.createElement('td');
        const frequencyTdEl = document.createElement('td');
        const completedTdEl = document.createElement('td');
        const dateTdEl = document.createElement('td');

        userNameTdEl.textContent = userName;
        nameTdEl.textContent = habitName;
        frequencyTdEl.textContent = habitFrequency;
        completedTdEl.textContent = habitCompleted;
        dateTdEl.textContent = habitDate;

        const rowEl = document.createElement('tr');
        rowEl.appendChild(userNameTdEl);
        rowEl.appendChild(nameTdEl);
        rowEl.appendChild(frequencyTdEl);
        rowEl.appendChild(completedTdEl);
        rowEl.appendChild(dateTdEl);

        tableBodyEl.appendChild(rowEl);
    }
    else{
        console.log("no habits");
    }
}

function clearGallery(){
    console.log("clearing gallery");

    try{
        const response = fetch('/api/completedHabits', {
            method: 'DELETE',
        });
        const completedHabits = response.json();
        localStorage.setItem('completedHabits', JSON.stringify(completedHabits));
    }
    catch{  
        localStorage.setItem('completedHabits', JSON.stringify([]));
    }
    window.location.href = "gallery.html";
}

// Functionality for peer communication using WebSocket
function configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    this.socket.onopen = (event) => {
      this.displayMsg('system', 'user', 'connected');
    };
    this.socket.onclose = (event) => {
      this.displayMsg('system', 'user', 'disconnected');
    };
    this.socket.onmessage = async (event) => {
      const msg = JSON.parse(await event.data.text());
      if (msg.type === HabitCompletedEvent) {
        this.displayMsg('user', msg.from, `completed ${msg.value.name}`);
      }
    };
  }

  function displayMsg(cls, from, msg) {
    const chatText = document.querySelector('#user-messages');
    chatText.innerHTML =
      `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
  }

  function broadcastEvent(from, type, value) {
    const event = {
      from: from,
      type: type,
      value: value,
    };
    this.socket.send(JSON.stringify(event));
  }