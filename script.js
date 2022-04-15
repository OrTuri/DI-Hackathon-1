"use strict";
// Selecting different HTML elements
const signUpLink = document.querySelector(".sign-up-link");
const logInLink = document.querySelector(".log-in-link");
const logInScreen = document.querySelector(".login-container");
const signUpScreen = document.querySelector(".sign-up-container");
const signUpBtnSubmit = document.querySelector(".sign-up-btn-submit");
const logInBtn = document.querySelector(".log-in-btn");
const signUpForm = document.forms.signUpForm;
const users = localStorage.getItem("data") ? localStorage.getItem("data") : [];
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
function checkIfUsernameExistAlready(name, array) {
  let exist;
  array.forEach((item) => {
    if (item.username === name) {
      exist = true;
    }
  });
  return exist;
}
// Function to take the data from the signup form and push it into an array
function signUpDataPushToArray(form, array) {
  const object = {};
  [...form.elements]
    .filter((input) => input.type !== "submit")
    .forEach((input) => {
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
logInBtn.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("logged in succesfully");
});
