import { getFromLocalStorage } from "./utils.js";
import { NOROFF_API_KEY } from "./constants.js";
import { CREATE_POST_URL } from "./constants.js";

const createPost = document.getElementById("postForm");

createPost.addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;

  const postElements = {
    title: title,
    body: body,
  };

  try {
    const accessToken = getFromLocalStorage("accessToken");
    const response = await fetch(CREATE_POST_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": `${NOROFF_API_KEY}`,
      },
      body: JSON.stringify(postElements),
    });

    if (response.ok) {
      alert("post created");
      window.location.href = "/index.html";
    } else {
      alert("uuups, something went horrible wrong!");
    }
  } catch (error) {
    alert("please try again, do not give up!");
  }
});
