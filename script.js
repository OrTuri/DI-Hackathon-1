"use strict";

// Selecting different HTML elements
const signUpLink = document.querySelector(".sign-up-link");
const logInLink = document.querySelector(".log-in-link");
const logInScreen = document.querySelector(".login-container");
const signUpScreen = document.querySelector(".sign-up-container");
const mainScreen = document.querySelector(".main-screen-container");
const signUpBtnSubmit = document.querySelector(".sign-up-btn-submit");
const logInBtn = document.querySelector(".log-in-btn");
const signUpForm = document.forms.signUpForm;
const mainHeading = document.querySelector(".main-heading");
const calendarTable = document.querySelector(".table");
const users = localStorage.getItem("data") ?
    JSON.parse(localStorage.getItem("data")) : [];
let currentUserIndex;
// Toggeling between the login and signup screens
function toggleSignUpLogInScreens() {
    logInScreen.classList.toggle("d-none");
    signUpScreen.classList.toggle("d-none");
}
signUpLink.addEventListener("click", function(e) {
    toggleSignUpLogInScreens();
});
logInLink.addEventListener("click", function(e) {
    toggleSignUpLogInScreens();
});
// Function to check if a username already exist in the database
function checkIfUsernameExistAlready(username, array) {
    let exist;
    array.forEach((item) => {
        if (item.username === username) {
            exist = true;
        }
    });
    return exist;
}
// Function to take the data from the signup form and push it into an array
function signUpDataPushToArray(form, array) {
    const object = {};
    [...form.elements]
    .forEach((input) => {
        console.log(input);
        object[input.className.slice(21)] = input.value;
        input.value = "";
    });
    array.push(object);
}

// Function to push the array into local storage
function pushArrayToLocalStorage(array) {
    localStorage.setItem("data", JSON.stringify(array));
}
// Looping over the signup inputs after the user submitted the signup form and pushing the data into the "users" array of objects
signUpBtnSubmit.addEventListener("click", function(e) {
    e.preventDefault();
    if (checkIfUsernameExistAlready(signUpForm.elements[0].value, users)) {
        alert(
            "This username is already taken! Please choose a different username!"
        );
    } else {
        signUpDataPushToArray(signUpForm, users);
        pushArrayToLocalStorage(users);
        toggleSignUpLogInScreens();
    }
});
// Function to validate login details
function validateLogin(array, username, password) {
    let userIndex;
    array.forEach((item, i) => {
        if (item.username === username) {
            userIndex = i;
        }
    });
    if (userIndex >= 0) {
        if (array[userIndex].password === password) {
            console.log("Logged in succesfully");
            currentUserIndex = userIndex;
            return true;
        } else {
            alert("Wrong password! Please try again!");
        }
    } else {
        alert(
            "Username does not exist in the database! Please try a different username or sign up!"
        );
    }
}
// Function that hides the login screen and display the main screen
function displayMainScreen() {
    logInScreen.classList.add("d-none");
    signUpScreen.classList.add("d-none");
    mainScreen.classList.toggle("d-none");
}
// Function that displays the main heading according to user's name
function mainHeadingContent() {
    const hour = new Date().getHours();
    let greeting;
    if (hour < 12 && hour > 6) greeting = "morning";
    else if (hour > 12 && hour < 18) greeting = "afternoon";
    else if (hour > 18 && hour < 24) greeting = "evening";
    else greeting = "night";
    mainHeading.textContent = `Hello ${users[currentUserIndex].name[0].toUpperCase() +
        users[currentUserIndex].name.slice(1).toLowerCase()
        }, have a good ${greeting}`;
}

// Function to create the user's calendar
const createCalendar = (year = new Date().getFullYear(), month = new Date().getMonth()) => {

    let tbl = document.querySelector(".table");
    let tblBody = document.querySelector(".tBody");

    let date = 1;
    // check how many days in a month 
    function daysInMonth(month, year) {
        return 32 - new Date(year, month, 32).getDate();
    }
    //Starting day of the month
    let firstDay = (new Date(year, month)).getDay();
    console.log(firstDay);

    // creating all cells
    for (let i = 0; i < 5; i++) {

        // creates a table row
        let row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {

            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode(".");
                cell.appendChild(cellText);
                row.appendChild(cell);

            } else if (date > daysInMonth(month, year)) {
                break;
            } else {
                let cell = document.createElement("td");
                cell.style.width = '50px'
                cell.style.height = '50px'
                let cellText = document.createTextNode(date);
                cell.appendChild(cellText);
                row.appendChild(cell);
                cell.classList = 'table-cells';
                cell.dataset.date = new Date(year, month, date).toLocaleString('en-il', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                if (currDay() === date) {
                    cell.style.background = '#D18CE0';
                    cell.style.color = 'white';
                }
                date++;
            }
        }

        // add the row to the end of the table body
        tblBody.appendChild(row);
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);

};

const currDay = () => {
    let currDay = new Date();
    return currDay.getDate();
};

// Actions that will happend after the user click on the "log in" button
logInBtn.addEventListener("click", function(e) {
    e.preventDefault();
    if (
        validateLogin(
            users,
            document.forms.logInForm.username.value,
            document.forms.logInForm.password.value
        )
    ) {
        mainHeadingContent();
        displayMainScreen();
        createCalendar();
        createModal();
    }
});

const createModal = () => {
    let cells = [...document.querySelectorAll('.table-cells')];
    console.log(cells);

    cells.forEach(cell => cell.addEventListener('click', () => {
        const modalTitle = document.querySelector('.modal-title')
        modalTitle.textContent = ''
        const span = document.createElement('span')
        let currDay = cell.dataset.date;
        span.append(currDay)
        span.style.color = '#A267AC'
        const strong = document.createElement('strong');
        strong.appendChild(document.createTextNode('TO DO LIST FOR '))
        modalTitle.append(strong)
        modalTitle.append(span)


        // document.querySelector('.modal-title').textContent = `TODO LIST FOR ${currDay}`;
        let myModal = new bootstrap.Modal(document.querySelector('.modal'));
        myModal.show();
    }));

    toDoList()
};

const toDoList = () => {
    // Define all UI variable
    const todoList = document.querySelector('.list-group');
    const form = document.querySelector('#form');
    const todoInput = document.querySelector('#todo');
    const clearBtn = document.querySelector('#clearBtn');
    const search = document.querySelector('#search');

    // Load all event listners
    allEventListners();


    // Functions of all event listners
    function allEventListners() {
        // Add todo event
        form.addEventListener('submit', addTodo);
        // Remove and complete todo event
        todoList.addEventListener('click', removeTodo);
        // Clear or remove all todos
        clearBtn.addEventListener('click', clearTodoList);
    }


    // Add todo item function
    function addTodo(e) {
        if (todoInput.value !== '') {
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'list-group-item';
            // Add complete and remove icon
            li.innerHTML = `<i class="far fa-square done-icon"></i>
                        <i class="far fa-check-square done-icon"></i>
                        <i class="far fa-trash-alt"></i>`;
            // Create span element
            const span = document.createElement('span');
            // Add class
            span.className = 'todo-text';
            // Create text node and append to span
            span.appendChild(document.createTextNode(todoInput.value));
            // Append span to li
            li.appendChild(span);
            // Append li to ul (todoList)
            todoList.appendChild(li);

            // Clear input
            todoInput.value = '';
        } else {
            alert('Please add todo');
        }

        e.preventDefault();
    }


    // Remove and complete todo item function
    function removeTodo(e) {
        // Remove todo
        if (e.target.classList.contains('fa-trash-alt')) {
            if (confirm('Are you sure')) {
                e.target.parentElement.remove();
            }
        }

        // Complete todo
        if (e.target.classList.contains('todo-text')) {
            e.target.parentElement.classList.toggle('done');
        }
        if (e.target.classList.contains('done-icon')) {
            e.target.parentElement.classList.toggle('done');
        }
    }


    // Clear or remove all todos function
    function clearTodoList() {
        todoList.innerHTML = '';
    }


    // Search todo function
    function searchTodo(e) {
        const text = e.target.value.toLowerCase();
        const allItem = document.querySelectorAll('.list-group-item');
        for (let task of allItem) {
            const item = task.textContent;
            if (item.toLowerCase().indexOf(text) != -1) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        };
    }

};