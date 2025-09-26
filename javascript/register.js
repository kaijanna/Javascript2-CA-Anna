import { AUTH_REGISTER_URL } from "./constants.js";

const registerForm = document.querySelector("#register-form");

async function registerUser(userDetails) {
  try {
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(AUTH_REGISTER_URL, fetchOptions);
    const json = await response.json();
    console.log(json);

    if (response.ok) {
      alert("user registered");

      window.location.href = "/html/login.html";
    } else {
      alert(
        "registration failed : " +
          (json.errors ? json.errors[0].message : "error")
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function onRegisterFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);
  registerUser(formFields);
}

registerForm.addEventListener("submit", onRegisterFormSubmit);
