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
let currentDateTask;
const users = localStorage.getItem("data")
  ? JSON.parse(localStorage.getItem("data"))
  : [];
let currentUserIndex;
// Toggeling between the login and signup screens
function toggleSignUpLogInScreens() {
  logInScreen.classList.toggle("d-none");
  signUpScreen.classList.toggle("d-none");
}
signUpLink.addEventListener("click", function (e) {
  toggleSignUpLogInScreens();
});
logInLink.addEventListener("click", function (e) {
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
  [...form.elements].forEach((input) => {
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
signUpBtnSubmit.addEventListener("click", function (e) {
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
  mainHeading.textContent = `Hello ${
    users[currentUserIndex].name[0].toUpperCase() +
    users[currentUserIndex].name.slice(1).toLowerCase()
  }, have a good ${greeting}`;
}

// Function to create the user's calendar
const createCalendar = (
  year = new Date().getFullYear(),
  month = new Date().getMonth()
) => {
  let tbl = document.querySelector(".table");
  let tblBody = document.querySelector(".tBody");

  let date = 1;
  // check how many days in a month
  function daysInMonth(month, year) {
    return 32 - new Date(year, month, 32).getDate();
  }
  //Starting day of the month
  let firstDay = new Date(year, month).getDay();
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
        let cellText = document.createTextNode(date);
        cell.appendChild(cellText);
        row.appendChild(cell);
        cell.classList.add("table-cell");
        cell.dataset.date = new Date(year, month, date);
        if (currDay() === date) {
          cell.style.background = "rgb(196, 101, 101)";
          cell.style.color = "#fff";
        }
        date++;
      }
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);

  // appends <table> into <body>
  // document.body.appendChild(tbl);
};

const currDay = () => {
  let currDay = new Date();
  return currDay.getDate();
};

// Actions that will happend after the user click on the "log in" button
logInBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    validateLogin(
      users,
      document.forms.logInForm.username.value,
      document.forms.logInForm.password.value
    )
  ) {
    displayMainScreen();
    mainHeadingContent();
    createCalendar();
    openTaskWindow();
  }
});
// A function that opens the modal tasks window
function openModal(date) {
  const modal = new bootstrap.Modal(document.querySelector("#exampleModal"));
  modal.show();
  document.querySelector(
    ".modal-title"
  ).textContent = `Todo list for ${new Date(date).toLocaleDateString("en-us", {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  })}`;
}
function openTaskWindow() {
  const tableCells = document.querySelectorAll(".table-cell");
  tableCells.forEach((cell) => {
    cell.addEventListener("click", function (e) {
      currentDateTask = new Date(cell.dataset.date);
      openModal(cell.dataset.date);
      clearTaskScreen();
      toDoList();
    });
  });
}
function toDoList() {
  const tasks = users[currentUserIndex].tasks
    ? users[currentUserIndex].tasks
    : (users[currentUserIndex].tasks = {});
  function loadTasks() {
    if (
      Object.keys(tasks).length > 0 &&
      tasks[String(currentDateTask)]?.length > 0
    ) {
      tasks[String(currentDateTask)].forEach((item) => {
        addTask(item);
      });
    } else {
      tasks[String(currentDateTask)] = [];
    }
  }
  loadTasks();
  const submitBtn = document.querySelector(".submit-btn");
  const taskInput = document.querySelector(".task-input");
  const taskList = document.querySelector(".task-list");
  const tasksList = users[currentUserIndex].tasks[String(currentDateTask)];
  submitBtn.title = "Add new task";
  function addTask(text) {
    const taskUl = document.querySelector(".task-ul");
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task");
    const textNode = document.createTextNode(text);
    const li = document.createElement("li");
    taskContainer.append(li);
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash");
    deleteIcon.title = "Delete";
    taskContainer.append(deleteIcon);
    li.append(textNode);
    taskUl.append(taskContainer);
    const checkbox = document.createElement("input");
    checkbox.title = "Mark as done";
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    taskContainer.append(checkbox);
    deleteIcon.style.marginLeft = "auto";
    deleteIcon.style.marginRight = "10px";
  }
  submitBtn.addEventListener("click", function (e) {
    checked();
    deleteTask();
    e.preventDefault();
    if (taskInput.value !== "") {
      tasks[String(currentDateTask)].push(taskInput.value);
      pushArrayToLocalStorage(users);
      addTask(taskInput.value);
      taskInput.value = "";
    }
  });
  checked();
  deleteTask();

  function checked() {
    const checkboxes = document.querySelectorAll(".checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("click", function (e) {
        if (this.checked) {
          e.target.closest("div").querySelector("li").classList.add("checked");
        } else {
          e.target
            .closest("div")
            .querySelector("li")
            .classList.remove("checked");
        }
      });
    });
  }
  function deleteTask() {
    const deleteIcons = document.querySelectorAll(".fa-trash");
    deleteIcons.forEach((deleteIcon) => {
      deleteIcon.addEventListener("click", function (e) {
        e.preventDefault();
        console.log(this.closest("div").querySelector("li").textContent);
        tasks[currentDateTask].splice(
          tasks[currentDateTask].indexOf(
            this.closest("div").querySelector("li").textContent
          ),
          1
        );
        pushArrayToLocalStorage(users);
        this.closest("div").remove();
      });
    });
  }
}
function clearTaskScreen() {
  document.querySelectorAll(".task").forEach((item) => {
    item.remove();
  });
}
