export const createBookmark = (url, title, description) => {
  return ({url, title, description, createdAt: new Date().toISOString()});
}

export const filterData = (bookmarks) => {
  if (!Array.isArray(bookmarks)) return [];

  return bookmarks.filter(b => b && typeof b === "object" && b.url && b.title);
};

export const sortBookmarks = (bookmarks) => {
  return [...bookmarks].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
}

