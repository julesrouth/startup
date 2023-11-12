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
            body: JSON.stringify(habit)
        });
        const habits = await response.json();
        localStorage.setItem('habits', JSON.stringify(habits));
    } catch{
        newHabitLocal(habit);
    }

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
        window.location.href = "habits.html";
    }
    else{
        console.log("too many habits");
    }
}

function incFrequency(habitName){
    console.log("increasing frequency");
    let habits = [];

    const habitsText = localStorage.getItem('habits');
    console.log(habitsText);
    
    if(habitsText){
        console.log("parsing habitsText");
        habits = JSON.parse(habitsText);
    }

    console.log(habits);

    for(var habit in habits){
        if(habits[habit].name == habitName){
            console.log("found habit");
            if(habits[habit].completed < habits[habit].frequency){
                habits[habit].completed++;
                console.log(habits[habit].completed);
                localStorage.setItem('habits', JSON.stringify(habits));
                window.location.href = "habits.html";
            }
            if(habits[habit].completed == habits[habit].frequency){
                console.log("habit completed");
                //add to gallery
                let completedHabits = [];

                const completedHabitsText = localStorage.getItem('completedHabits');
                
                if(completedHabitsText){
                    completedHabits = JSON.parse(completedHabitsText);
                }
                userName = localStorage.getItem('userName');
                completedHabit = { userName: userName, name: habitName, frequency: habits[habit].frequency, completed: habits[habit].completed, date: new Date().toLocaleDateString() };
                completedHabits.push(completedHabit);
                localStorage.setItem('completedHabits', JSON.stringify(completedHabits));
                //remove from habits
                habits.splice(habit, 1);
                localStorage.setItem('habits', JSON.stringify(habits));
                window.location.href = "habits.html";
            }
        }
    }

}


async function loadHabits(){
    console.log("loading habits");
    let habits = [];
    var habitsText = "";
    // try{
    //     const response = fetch('/api/habits');
    //     habits = await response.json();
    //     localStorage.setItem('habits', JSON.stringify(habits));
    // }
    // catch{
    //     habitsText = localStorage.getItem('habits');
    // }
    habitsText = localStorage.getItem('habits');
    
    if(habitsText){
        habits = JSON.parse(habitsText);
        console.log(habits);
        for(var habit in habits){
            console.log(habit);
            console.log(habits[habit].user)
            addHabit(habits[habit].name, habits[habit].frequency, habits[habit].completed);
        }
    }
}

function addHabit(habitName, habitFrequency, habitCompleted){
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
    localStorage.setItem('habits', JSON.stringify([]));
    window.location.href = "habits.html";
}

async function loadCompletedHabits(){
    let completedHabits = [];
    var completedHabitsText = "";
    try{
        const response = fetch('/api/completedHabits');
        completedHabits = await response.json();
        localStorage.setItem('habits', JSON.stringify(completedHabits));
    }
    catch{
        completedHabitsText = localStorage.getItem('completeHabits');
        if(completedHabitsText){
            completedHabits = JSON.parse(completedHabitsText);
        }
    }

    for(var habit in completedHabits){
        console.log(habit);
        addHabitToGallery(completedHabits[habit].user, completedHabits[habit].name, completedHabits[habit].frequency, completedHabits[habit].completed, completedHabits[habit].date);
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
    localStorage.setItem('completedHabits', JSON.stringify([]));
    window.location.href = "gallery.html";
}