import { AUTH_LOGIN_URL } from "./constants.js";
import { addToLocalStorage } from "./utils.js";

const loginForm = document.querySelector("#login-form");

async function loginUser(userDetails) {
  try {
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(AUTH_LOGIN_URL, fetchOptions);
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      const accessToken = json.data.accessToken;
      const userName = json.data.name;

      addToLocalStorage("accessToken", accessToken);
      addToLocalStorage("userName", userName);

      window.location.href = "/index.html";
    }
  } catch (error) {
    console.log(error);
  }
}

function onLoginFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);
  loginUser(formFields);
}

loginForm.addEventListener("submit", onLoginFormSubmit);
