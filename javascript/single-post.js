import { CREATE_POST_URL } from "./constants.js";
import { getFromLocalStorage } from "./utils.js";
import { NOROFF_API_KEY } from "./constants.js";

const singlePostContainer = document.getElementById("singlePost");
const editBt = document.getElementById("editBt");

const postId = new URLSearchParams(window.location.search);
const id = postId.get(`id`);

async function getPostByIdCreate() {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    const apiKey = NOROFF_API_KEY;

    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
        Accept: "application/json",
      },
    };

    const response = await fetch(
      `${CREATE_POST_URL}/${id}?_author=true`,
      options
    );

    const data = await response.json();
    const post = data.data;

    displaySinglePost(post);
  } catch (err) {
    singlePostContainer.innerHTML = "oh no something went wrong";
  }
}

/**
 * This displays one single post on the page
 * It updates the html with: title, body of text and the author.
 * it shows the edit button and delete button if the user is the author
 * @param {Object} post - shows the post-object
 */

function displaySinglePost(post) {
  singlePostContainer.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    <p><strong>Author:</strong> ${post.author.name}</p>

`;
  const currentUser = getFromLocalStorage("userName");

  if (post.author.name === currentUser) {
    editBt.innerHTML = `
      <a href="/html/edit-post.html?id=${post.id}" class="button-style">Edit post</a>
    `;
    deleteBt.innerHTML = `<button class="button-style">delete</button>`;
  } else {
    editBt.innerHTML = "";
    deleteBt.innerHTML = "";
  }
}

getPostByIdCreate();

deleteBt.addEventListener("click", async () => {
  const sure = confirm("Are you sure you want to delete this post?");
  if (!sure) {
    return;
  }
  const accessToken = getFromLocalStorage("accessToken");
  const apiKey = NOROFF_API_KEY;

  const res = await fetch(`${CREATE_POST_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  if (res.ok) {
    alert("Post deleted!");
    window.location.href = "/index.html";
  } else {
    alert("Could not delete the post");
  }
});
