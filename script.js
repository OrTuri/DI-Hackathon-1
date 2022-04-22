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
let currentYear;
let currentMonth;
let date;
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

function hideMainScreen() {
  logInScreen.classList.remove("d-none");
  signUpScreen.classList.add("d-none");
  mainScreen.classList.add("d-none");
}
// Function that displays the main heading according to user's name
function mainHeadingContent() {
  function firstLetterUpper(string) {
    return string
      .split(" ")
      .map((item) => {
        return item.at(0).toUpperCase() + item.slice(1).toLowerCase();
      })
      .join(" ");
  }
  const name = firstLetterUpper(users[currentUserIndex].name);
  const hour = new Date().getHours();
  let greeting;
  if (hour < 12 && hour > 6) greeting = "morning";
  else if (hour >= 12 && hour <= 18) greeting = "afternoon";
  else if (hour > 18 && hour < 0) greeting = "evening";
  else greeting = "night";
  mainHeading.textContent = `Hello ${name}, have a good ${greeting}`;
}
// Function to create the user's calendar
const createCalendar = (
  year = new Date().getFullYear(),
  month = new Date().getMonth()
) => {
  currentYear = year;
  currentMonth = month;
  createCurrentDateTitle(new Date(year, month));
  let daysOver = 1;
  const fullDate = new Date(year, month);
  let tbl = document.querySelector(".table-bordered");
  let tblBody = document.querySelector(".tBody");

  let date = 1;
  // check how many days in a month
  function daysInMonth(month, year) {
    return 32 - new Date(year, month, 32).getDate();
  }
  //Starting day of the month
  let firstDay = new Date(year, month).getDay();
  let monthBefore = daysInMonth(month - 1, year) - firstDay + 1;
  // creating all cells
  for (let i = 0; i < 5; i++) {
    // creates a table row
    let row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        let cell = document.createElement("td");
        let cellText = document.createTextNode(monthBefore);
        monthBefore++;
        cell.style.lineHeight = "50px";
        cell.style.color = "#a3a3a3";
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > daysInMonth(month, year)) {
        let cell = document.createElement("td");
        let cellText = document.createTextNode(daysOver);
        daysOver++;
        cell.style.lineHeight = "50px";
        cell.style.color = "#a3a3a3";
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else {
        let cell = document.createElement("td");
        cell.style.maxWidth = "100px";
        cell.style.maxHeight = "100px";
        let cellText = document.createTextNode(date);
        cell.appendChild(cellText);
        row.appendChild(cell);
        cell.classList = "table-cells";
        cell.dataset.date = new Date(year, month, date).toLocaleString(
          "en-il",
          { weekday: "long", year: "numeric", month: "long", day: "numeric" }
        );
        if (
          currDay() === date &&
          fullDate.getTime() ===
            new Date(new Date().getFullYear(), new Date().getMonth()).getTime()
        ) {
          cell.style.background = "#D18CE0";
          cell.style.color = "white";
        }
        date++;
      }
    }
    // add the row to the end of the table body
    tblBody.appendChild(row);
  }
  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  if (users[currentUserIndex].hasOwnProperty("tasks")) {
    for (let date of Object.entries(users[currentUserIndex].tasks)) {
      if (date[1].length > 0) {
        createCellDot(date[0]);
      }
    }
  }
};
const currDay = () => {
  let currDay = new Date();
  return currDay.getDate();
};

function createCurrentDateTitle(date = new Date()) {
  date = new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
  });
  const container = document.querySelector(".dateTitle");
  let textNode = "Current date: \n " + date;
  container.append(textNode);
}
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
    mainHeadingContent();
    displayMainScreen();
    createCalendar();
    createModal();
  }
});
const createModal = () => {
  let cells = [...document.querySelectorAll(".table-cells")];
  cells.forEach((cell) =>
    cell.addEventListener("click", () => {
      const modalTitle = document.querySelector(".modal-title");
      modalTitle.textContent = "";
      const span = document.createElement("span");
      let currDay = cell.dataset.date;
      span.append(currDay);
      span.style.color = "#A267AC";
      const strong = document.createElement("strong");
      strong.appendChild(document.createTextNode("TO DO LIST FOR "));
      modalTitle.append(strong);
      modalTitle.append(span);
      date = cell.dataset.date;
      // document.querySelector('.modal-title').textContent = `TODO LIST FOR ${currDay}`;
      let myModal = new bootstrap.Modal(document.querySelector(".modal"));
      myModal.show();
      removeTasksFromDisplay();
      if (users[currentUserIndex].hasOwnProperty("tasks")) {
        if (users[currentUserIndex].tasks.hasOwnProperty(date)) {
          loadTasks(users[currentUserIndex].tasks[date]);
        }
      }
    })
  );
};

function loadTasks(tasksArray) {
  const todoList = document.querySelector(".list-group");
  tasksArray.forEach((task) => {
    // Create li element
    const li = document.createElement("li");
    // Add class
    li.className = "list-group-item";
    // Add complete and remove icon
    li.innerHTML = `<i class="far fa-square done-icon"></i>
                      <i class="far fa-check-square done-icon"></i>
                      <i class="far fa-trash-alt"></i>`;
    // Create span element
    const span = document.createElement("span");
    // Add class
    span.className = "todo-text";
    // Create text node and append to span
    span.appendChild(document.createTextNode(task[0]));
    // Append span to li
    li.appendChild(span);
    // Append li to ul (todoList)
    todoList.appendChild(li);
    // Clear input
    if (task[1]) {
      li.classList.toggle("done");
    }
  });
}

function createCellDot(date) {
  const cells = document.querySelectorAll(".table-cells");
  cells.forEach((cell) => {
    if (cell.dataset.date === date) {
      const div = document.createElement("div");
      div.className = "cellDot";
      div.style.width = "15%";
      div.style.height = "15%";
      div.style.borderRadius = "50%";
      div.style.margin = "auto";
      div.style.backgroundColor = "#D1D1D1";
      cell.style.position = "relative";
      div.style.position = "absolute";
      div.style.top = "5px";
      div.style.left = "44%";
      div.style.display = "flex";
      div.style.justifyContent = "center";
      div.style.alignItems = "center";
      cell.append(div);
    }
  });
}

function removeCellDot(date) {
  const cells = document.querySelectorAll(".table-cells");
  cells.forEach((cell) => {
    if (cell.dataset.date === date) {
      const textNode = document.createTextNode(
        cell.querySelector("div").innerText
      );
      cell.querySelector("div").remove();
      cell.append(textNode);
      cell.style.color = "#000";
    }
  });
}
const toDoList = () => {
  // Define all UI variable
  const todoList = document.querySelector(".list-group");
  const form = document.querySelector("#form");
  const todoInput = document.querySelector("#todo");
  const clearBtn = document.querySelector("#clearBtn");

  function pushTaskToArray(task) {
    if (users[currentUserIndex].hasOwnProperty("tasks")) {
      if (users[currentUserIndex].tasks.hasOwnProperty(date)) {
        users[currentUserIndex].tasks[date].push([task, false]);
      } else {
        users[currentUserIndex].tasks[date] = [];
        users[currentUserIndex].tasks[date].push([task, false]);
      }
    } else {
      users[currentUserIndex].tasks = {};
      users[currentUserIndex].tasks[date] = [];
      users[currentUserIndex].tasks[date].push([task, false]);
    }
  }
  // Load all event listners
  allEventListners();
  // Functions of all event listners
  function allEventListners() {
    // Add todo event
    form.addEventListener("submit", addTodo);
    // Remove and complete todo event
    todoList.addEventListener("click", removeTodo);
    // Clear or remove all todos
    clearBtn.addEventListener("click", clearTodoList);
  }
  // Add todo item function
  function addTodo(e) {
    e.preventDefault();
    if (todoInput.value !== "") {
      // Create li element
      const li = document.createElement("li");
      // Add class
      li.className = "list-group-item";
      // Add complete and remove icon
      li.innerHTML = `<i class="far fa-square done-icon"></i>
                        <i class="far fa-check-square done-icon"></i>
                        <i class="far fa-trash-alt"></i>`;
      // Create span element
      const span = document.createElement("span");
      // Add class
      span.className = "todo-text";
      // Create text node and append to span
      span.appendChild(document.createTextNode(todoInput.value));
      // Append span to li
      li.appendChild(span);
      // Append li to ul (todoList)
      todoList.appendChild(li);
      pushTaskToArray(todoInput.value);
      pushArrayToLocalStorage(users);
      createCellDot(date);
      // Clear input
      todoInput.value = "";
    } else {
      alert("Please add todo");
    }
  }
  // Remove and complete todo item function
  function removeTodo(e) {
    // Remove todo
    if (e.target.classList.contains("fa-trash-alt")) {
      if (confirm("Are you sure")) {
        e.target.parentElement.remove();
        users[currentUserIndex].tasks[date].splice(
          users[currentUserIndex].tasks[date].findIndex((element, i) => {
            if (
              element[0] ===
              e.target.parentElement.querySelector(".todo-text").innerText
            ) {
              return true;
            }
          }),
          1
        );
        pushArrayToLocalStorage(users);
      }
    }
    // Complete todo
    if (
      e.target.classList.contains("todo-text") ||
      e.target.classList.contains("done-icon")
    ) {
      e.target.parentElement.classList.toggle("done");
      users[currentUserIndex].tasks[date].forEach((taskArr) => {
        if (
          taskArr[0] ===
          e.target.parentElement.querySelector(".todo-text").innerText
        ) {
          taskArr[1] = taskArr[1] ? false : true;
        }
      });
      pushArrayToLocalStorage(users);
    }
    if (users[currentUserIndex].tasks[date].length < 1) {
      removeCellDot(date);
    }
  }
  // Clear or remove all todos function
  function clearTodoList() {
    if (confirm("Are you sure you want to delete all the tasks?")) {
      todoList.innerHTML = "";
      users[currentUserIndex].tasks[date] = [];
      pushArrayToLocalStorage(users);
      removeCellDot(date);
    }
  }
};
toDoList();

function removeCurrentCalendar() {
  const tableBody = document.querySelector(".tBody");
  tableBody.remove();
  const tableBody2 = document.createElement("tbody");
  tableBody2.className = "tBody text-center";
  document.querySelector(".table-bordered").append(tableBody2);
  document.querySelector(".dateTitle").textContent = "";
}
const calendarForm = document.forms.calendarForm;
calendarForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const year = calendarForm.year.value;
  const month = calendarForm.month.value;
  if (year !== "" && month !== "") {
    removeCurrentCalendar();
    createCalendar(year, month);
    createModal();
  }
});
document.querySelector(".logout-btn").addEventListener("click", function (e) {
  currentUserIndex = undefined;
  hideMainScreen();
  removeCurrentCalendar();
});

function removeTasksFromDisplay() {
  const tasks = document.querySelectorAll(".list-group-item");
  tasks.forEach((task) => {
    task.remove();
  });
}
// The function calls are located in the HTML document.
// The function is switching between the next and previous months with arrows.
function switchMonths(num) {
  removeCurrentCalendar();
  createCalendar(currentYear, currentMonth + num);
  createModal();
}
