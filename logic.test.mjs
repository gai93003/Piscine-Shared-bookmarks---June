// import { expression } from "@babel/template";
import { getUserIds } from "./storage";
import { createBookmark, filterData, sortBookmarks } from "./logic.mjs";

test("Must contain at least five users", () => {
    const users = getUserIds();
    expect(users.length).toBe(5);
});

test('createBookmark returns a bookmark object with expected properties', () => {
  const url = 'https://example.com';
  const title = 'Example';
  const description = 'An example website';

  const bookmark = createBookmark(url, title, description);

  expect(bookmark).toMatchObject({ url, title, description });
  expect(bookmark.createdAt).toBeDefined();
  expect(new Date(bookmark.createdAt).toString()).not.toBe('Invalid Date');
});

test('filterData removes entries that are not valid bookmark objects', () => {
  const input = [
    { url: 'https://site1.com', title: 'Site 1' },
    null,
    { url: '', title: 'No URL' },
    { title: 'Missing URL' },
    { url: 'https://site2.com' },
    'random string',
    123,
    { url: 'https://site3.com', title: 'Site 3' }
  ];

  const result = filterData(input);

  expect(result).toEqual([
    { url: 'https://site1.com', title: 'Site 1' },
    { url: 'https://site3.com', title: 'Site 3' }
  ]);
});

test('filterData returns empty array when input is not an array', () => {
  expect(filterData(null)).toEqual([]);
  expect(filterData(undefined)).toEqual([]);
  expect(filterData('not an array')).toEqual([]);
});



test('sortBookmarks sorts bookmarks by createdAt descending', () => {
  const bookmarks = [
    { url: '1', title: 'First', createdAt: '2023-01-01T00:00:00.000Z' },
    { url: '2', title: 'Second', createdAt: '2023-03-01T00:00:00.000Z' },
    { url: '3', title: 'Third', createdAt: '2023-02-01T00:00:00.000Z' }
  ];

  const sorted = sortBookmarks(bookmarks);
  expect(sorted.map(b => b.url)).toEqual(['2', '3', '1']);
});


test('sortBookmarks treats missing createdAt as oldest', () => {
  const bookmarks = [
    { url: 'a', title: 'No date' },
    { url: 'b', title: 'With date', createdAt: '2023-05-01T00:00:00.000Z' }
  ];

  const sorted = sortBookmarks(bookmarks);
  expect(sorted[0].url).toBe('b');
  expect(sorted[1].url).toBe('a');
});


test('sortBookmarks does not mutate original array', () => {
  const original = [
    { url: 'x', title: 'X', createdAt: '2023-01-01T00:00:00.000Z' },
    { url: 'y', title: 'Y', createdAt: '2023-04-01T00:00:00.000Z' }
  ];

  const clone = [...original];
  sortBookmarks(original);
  expect(original).toEqual(clone); // not mutated
});


test('createBookmark + filterData + sortBookmarks integration', () => {
  const bookmarks = [
    createBookmark('https://b.com', 'B', 'desc'),
    createBookmark('https://a.com', 'A', 'desc'),
    null,
    { title: 'Missing URL' }
  ];

  const filtered = filterData(bookmarks);
  const sorted = sortBookmarks(filtered);

  expect(sorted[0].url).toBe('https://b.com');
  expect(sorted.length).toBe(2);
});