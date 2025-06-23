// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds, setData, getData, clearData } from "./storage.js";
const userDropdown = document.getElementById('select-users');
const urlInput = document.getElementById('url-input');
const titleInput = document.getElementById('title-input');
const description = document.getElementById('description');
const submitBtn = document.getElementById('submit-btn');
const showBookmarks = document.getElementById('show-bookmarks');

const populateDropdown = () => {
  const users = getUserIds();

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'Select User'
  userDropdown.appendChild(defaultOpt);

  for (let user of users) {
    const option = document.createElement('option');
    option.value = user;
    option.textContent = `User ${user}`;

    userDropdown.appendChild(option);
  };
};

const createBookmark = (url, title, description) => {
  return ({url, title, description, createdAt: new Date().toDateString()});
}

const addBookmarkToUser = (userId, bookmark, getData, setData) => {
  if(!userId) throw new Error("No user selected");

  let bookmarks = getData(userId) || [];

  if(!Array.isArray(bookmarks)) {
    bookmarks = [];
  }

  bookmarks.push(bookmark);
  setData(userId, bookmarks);

  return bookmarks;
}

const addData = () => {
  if (userDropdown.value === '') {
    alert('Please select a user');
    return;
  }

  const newBookmark = createBookmark(urlInput.value, titleInput.value, description.value)
  

  addBookmarkToUser(selectedUser, newBookmark, getData, setData);

  setData(userId, newBookmark);

  titleInput.value = '';
  urlInput.value = '';
  description = '';
}

const filterData = (bookmarks) => {
  if (!Array.isArray(bookmarks)) return [];

  return bookmarks.filter(b => b && typeof b === "object" && b.url && b.title);
};

const sortBookmarks = (bookmarks) => {
  return [...bookmarks].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
}


window.onload = function () {
  populateDropdown();
  const users = getUserIds();
  // document.querySelector("body").innerText = `There are ${users.length} users`;
};
