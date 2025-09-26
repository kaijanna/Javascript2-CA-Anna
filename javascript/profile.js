import { PROFILES_URL, NOROFF_API_KEY } from "./constants.js";
import { getFromLocalStorage } from "./utils.js";

const avatarImg = document.getElementById("avatarImg");
const profileNameEl = document.getElementById("profileName");
const profileEmailEl = document.getElementById("profileEmail");
const postsEl = document.getElementById("userPosts");
const followBtn = document.getElementById("followBtn");
const unfollowBtn = document.getElementById("unfollowBtn");

const params = new URLSearchParams(window.location.search);
const viewedName = params.get("name");

const token = getFromLocalStorage("accessToken");
if (!token) {
  window.location.href = "/html/login.html";
}

function authHeaders() {
  return {
    Authorization: "Bearer " + token,
    "X-Noroff-API-Key": NOROFF_API_KEY,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

async function fetchProfile(name) {
  const res = await fetch(
    PROFILES_URL + "/" + name + "?_followers=true&_following=true",
    {
      headers: authHeaders(),
    }
  );
  const json = await res.json();
  return json.data;
}

async function fetchUserPosts(name) {
  const res = await fetch(PROFILES_URL + "/" + name + "/posts", {
    headers: authHeaders(),
  });
  const json = await res.json();
  return json.data;
}

function renderProfile(profile) {
  var url = "/images/logo-icon.png";

  if (profile.avatar) {
    var apiUrl = profile.avatar.url;
    if (apiUrl) {
      if (
        apiUrl.indexOf("placeholder") === -1 &&
        apiUrl.indexOf("unsplash") === -1
      ) {
        url = apiUrl;
      }
    }
  }

  avatarImg.src = url;

  profileNameEl.textContent = profile.name;
  profileEmailEl.textContent = profile.email;

  var currentUser = getFromLocalStorage("userName");
  if (currentUser == profile.name) {
    followBtn.style.display = "none";
    unfollowBtn.style.display = "none";
  } else {
    followBtn.style.display = "block";
    unfollowBtn.style.display = "none";
  }
}

function setInitialFollowState(profile) {
  const currentUser = getFromLocalStorage("userName");

  if (currentUser == profile.name) {
    followBtn.style.display = "none";
    unfollowBtn.style.display = "none";
    followStatus.textContent = "";
    return;
  }

  var alreadyFollower = false;
  if (profile.followers) {
    var i = 0;
    while (i < profile.followers.length) {
      var f = profile.followers[i];
      if (f && f.name == currentUser) {
        alreadyFollower = true;
      }
      i = i + 1;
    }
  }

  if (alreadyFollower) {
    followBtn.style.display = "none";
    unfollowBtn.style.display = "block";
    followStatus.textContent = "You are following this user";
  } else {
    followBtn.style.display = "block";
    unfollowBtn.style.display = "none";
    followStatus.textContent = "";
  }
}

const followingList = document.getElementById("followingList");

function renderFollowing(profile) {
  followingList.innerHTML = "";

  if (!profile.following || profile.following.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Not following anyone yet";
    followingList.appendChild(li);
    return;
  }

  profile.following.forEach(function (user) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = "/html/profile.html?name=" + user.name;
    link.textContent = user.name;
    li.appendChild(link);
    followingList.appendChild(li);
  });
}

function renderFollowers(profile) {
  followersList.innerHTML = "";

  if (!profile.followers || profile.followers.length === 0) {
    const li = document.createElement("li");
    li.textContent = "None is following you yet";
    followersList.appendChild(li);
    return;
  }

  profile.followers.forEach(function (user) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = "/html/profile.html?name=" + user.name;
    link.textContent = user.name;
    li.appendChild(link);
    followersList.appendChild(li);
  });
}

function renderPosts(posts) {
  postsEl.innerHTML = "";
  if (!posts) {
    const p = document.createElement("p");
    p.textContent = "No post yet";
    postsEl.appendChild(p);
    return;
  }

  if (posts.length == 0) {
    const p = document.createElement("p");
    p.textContent = "No post yet";
    postsEl.appendChild(p);
    return;
  }

  posts.forEach(function (post) {
    const card = document.createElement("article");
    const h4 = document.createElement("h4");
    const body = document.createElement("p");
    const link = document.createElement("a");

    h4.textContent = post.title;
    if (post.body) {
      body.textContent = post.body;
    } else {
      body.textContent = "";
    }
    link.href = "/html/single-post.html?id=" + post.id;
    link.textContent = "Go to post";
    link.classList.add("button-style");

    card.appendChild(h4);
    card.appendChild(body);
    card.appendChild(link);
    postsEl.appendChild(card);
  });
}

const followStatus = document.getElementById("followStatus");

async function handleFollow() {
  const res = await fetch(PROFILES_URL + "/" + viewedName + "/follow", {
    method: "PUT",
    headers: authHeaders(),
  });
  if (res.ok) {
    followBtn.style.display = "none";
    unfollowBtn.style.display = "block";
    followStatus.textContent = "You are following this user";
  } else {
    alert("could not follow");
  }
}

async function handleUnfollow() {
  const res = await fetch(PROFILES_URL + "/" + viewedName + "/unfollow", {
    method: "PUT",
    headers: authHeaders(),
  });
  if (res.ok) {
    unfollowBtn.style.display = "none";
    followBtn.style.display = "block";
    followStatus.textContent = "";
  } else {
    alert("could not unfollow");
  }
}

followBtn.addEventListener("click", handleFollow);
unfollowBtn.addEventListener("click", handleUnfollow);

async function main() {
  const profile = await fetchProfile(viewedName);
  renderProfile(profile);
  setInitialFollowState(profile);
  renderFollowing(profile);
  renderFollowers(profile);

  const posts = await fetchUserPosts(viewedName);
  renderPosts(posts);
}

main();
