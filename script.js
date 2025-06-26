import { getUserIds, setData, getData, clearData } from "./storage.js";
import { createBookmark, filterData, sortBookmarks } from "./logic.mjs";

const userDropdown = document.getElementById('select-users');
const urlInput = document.getElementById('url-input');
const titleInput = document.getElementById('title-input');
const descriptionInput = document.getElementById('description');
const submitBtn = document.getElementById('submit-btn');
const informUser = document.getElementById('inform-user');
const showBookmarks = document.getElementById('show-bookmarks');

const populateDropdown = () => {
  const users = getUserIds();
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'Select User';
  userDropdown.appendChild(defaultOpt);

  for (let user of users) {
    const option = document.createElement('option');
    option.value = user;
    option.textContent = `User ${user}`;
    userDropdown.appendChild(option);
  }
};

const addBookmarkToUser = (userId, bookmark, getData, setData) => {
  if (!userId) throw new Error("No user selected");

  let bookmarks = getData(userId) || [];
  if (!Array.isArray(bookmarks)) bookmarks = [];

  bookmarks.push(bookmark);
  setData(userId, bookmarks);
  return bookmarks;
};

const addData = () => {
  const userId = userDropdown.value;
  if (!userId) {
    alert("Please select a user");
    return;
  }

  const url = urlInput.value.trim();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!url || !title || !description) {
    alert("Please enter the URL, title, and description.");
    return;
  }

  const newBookmark = createBookmark(url, title, description);
  addBookmarkToUser(userId, newBookmark, getData, setData);
  displayBookmarks();

  urlInput.value = '';
  titleInput.value = '';
  descriptionInput.value = '';
};

const createBookmarkElement = (bookmark) => {
  const bookmarkElement = document.createElement("div");

  const title = document.createElement('h2');
  const link = document.createElement('a');
  link.href = bookmark.url;
  link.textContent = bookmark.title;
  title.appendChild(link);

  const description = document.createElement('p');
  description.textContent = bookmark.description || "No description provided.";

  const timestamp = document.createElement('h2');
  const str = document.createElement('strong');
  const span = document.createElement('span');
  str.textContent = 'Created At:';
  span.textContent = bookmark.createdAt
    ? new Date(bookmark.createdAt).toLocaleString()
    : 'Unknown';
  timestamp.appendChild(str);
  timestamp.appendChild(span);

  bookmarkElement.appendChild(title);
  bookmarkElement.appendChild(description);
  bookmarkElement.appendChild(timestamp);
  showBookmarks.appendChild(bookmarkElement);
};

const displayBookmarks = () => {
  const selectedUser = userDropdown.value;
  showBookmarks.innerHTML = '';
  informUser.innerHTML = '';

  if (!selectedUser) return;

  let bookmarks = getData(selectedUser);

  if (!Array.isArray(bookmarks)) {
    console.warn(`Invalid data format for user ${selectedUser}`, bookmarks);
    bookmarks = [];
  }

  bookmarks = filterData(bookmarks);

  if (bookmarks.length === 0) {
    informUser.textContent = `No bookmarks found for User ${selectedUser}`;
    return;
  }

  bookmarks = sortBookmarks(bookmarks);

  bookmarks.forEach(bookmark => {
    createBookmarkElement(bookmark);
  });
};


// Event listeners
userDropdown.addEventListener('change', displayBookmarks);

submitBtn.addEventListener('click', () => {
  if (userDropdown.value === '') {
    alert('Please select a user');
    return;
  }
  displayBookmarks()
  addData();

});

window.onload = populateDropdown;
