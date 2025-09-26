import { getFromLocalStorage } from "./utils.js";

function isLoggedIn() {
  const token = getFromLocalStorage("accessToken");
  if (token) {
    return true;
  } else {
    return false;
  }
}

/**
 * updates witch element to show, based on who is logged in
 * shows buttons for login and registration when not logged in
 * showes my profile and logout when user is logged in.
 */
function updateAuthUI() {
  const loggedIn = isLoggedIn();
  const userName = getFromLocalStorage("userName");

  const loggedInElements = document.querySelectorAll('[data-auth="logged-in"]');
  const loggedOutElements = document.querySelectorAll(
    '[data-auth="logged-out"]'
  );
  const myProfileLink = document.getElementById("myProfileLink");
  const slot = document.getElementById("userNameSlot");

  if (loggedIn === true) {
    loggedInElements.forEach(function (el) {
      el.style.display = "";
    });
    loggedOutElements.forEach(function (el) {
      el.style.display = "none";
    });

    if (slot) {
      slot.textContent = userName;
    }
  } else {
    loggedInElements.forEach(function (el) {
      el.style.display = "none";
    });
    loggedOutElements.forEach(function (el) {
      el.style.display = "";
    });
  }
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("apiKey");
  localStorage.removeItem("userName");

  updateAuthUI();
  window.location.href = "/index.html";
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

updateAuthUI();

const myProfileLink = document.getElementById("myProfileLink");
const userName = getFromLocalStorage("userName");

if (userName) {
  myProfileLink.href = "/html/profile.html?name=" + userName;
} else {
  myProfileLink.style.display = "none";
}
