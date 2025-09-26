import { POST_URL } from "./constants.js";

import { getFromLocalStorage } from "./utils.js";
import { NOROFF_API_KEY } from "./constants.js";

const displayContainer = document.getElementById("display-container");
const searchInput = document.getElementById("searchInput");

let allPosts = [];

/**
 * Get all the posts from the noroff api
 * it uses the accessToken from localstorage and puts the api-key in the header
 * @async
 * @returns {Promise<Array>} returns a list of post from the api
 */
async function fetchPosts() {
  try {
    const accessToken = getFromLocalStorage("accessToken");

    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": `${NOROFF_API_KEY}`,
      },
    };
    const response = await fetch(POST_URL, options);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
  }
}

function generatePosts(posts) {
  displayContainer.innerHTML = "";

  posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("blog-post");

    postDiv.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    <p><strong>Author:</strong> <a href="/html/profile.html?name=${post.author.name}">
          ${post.author.name}
        </a></p>
    <a class="button-style" href="/html/single-post.html?id=${post.id}">Read post</a>
    `;
    displayContainer.append(postDiv);
  });
}

function filterPosts(query) {
  const search = query.toLowerCase();
  const filtered = allPosts.filter(function (post) {
    const title = post.title.toLowerCase();
    const body = post.body.toLowerCase();

    if (title.includes(search)) {
      return true;
    }
    if (body.includes(search)) {
      return true;
    }
    return false;
  });
  generatePosts(filtered);
}

searchInput.addEventListener("input", (e) => {
  const query = e.target.value;
  filterPosts(query);
});

async function main() {
  allPosts = await fetchPosts();
  generatePosts(allPosts);
}

main();
