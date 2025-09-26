import { getFromLocalStorage } from "./utils.js";
import { CREATE_POST_URL } from "./constants.js";
import { NOROFF_API_KEY } from "./constants.js";

const form = document.getElementById("editForm");
const titleEl = document.getElementById("title");
const bodyEl = document.getElementById("body");

const params = new URLSearchParams(window.location.search);
const id = params.get("id"); 

(async function loadPost() {
  const accessToken = getFromLocalStorage("accessToken");
  const apiKey = NOROFF_API_KEY;
  const res = await fetch(`${CREATE_POST_URL}/${id}?_author=true`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
      "Content-Type": "application/json",
    },
  });
  const { data } = await res.json();
  titleEl.value = data.title;
  bodyEl.value = data.body;
})();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const accessToken = getFromLocalStorage("accessToken");
  const apiKey = NOROFF_API_KEY;

  const fillPost = {
    title: titleEl.value,
    body: bodyEl.value,
  };

  const res = await fetch(`${CREATE_POST_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fillPost),
  });

  if (res.ok) {
    window.location.href = `/html/single-post.html?id=${id}`;
  }
});
