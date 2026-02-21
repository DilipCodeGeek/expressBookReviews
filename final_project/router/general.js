const express = require('express');
const axios = require('axios');   // Task 10
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!isValid(username)) {
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered. Now you can login." });
  } else {
    return res.status(409).json({ message: "Username already exists" });
  }

});


// ===============================
// Task 1 - Get all books
// ===============================
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});


// ===============================
// Task 10 - Get all books using Async/Await with Axios
// ===============================
public_users.get('/async/books', async function (req, res) {

  try {
    const response = await axios.get('http://localhost:5000/');

    return res.status(200).json({
      message: "Books fetched successfully (Async)",
      books: response.data
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books",
      error: error.message
    });
  }

});


// ===============================
// Get book details based on ISBN
// ===============================
public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

});


// ===============================
// Get book details based on Author
// ===============================
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;
  let booksByAuthor = {};
  const bookKeys = Object.keys(books);

  bookKeys.forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor[key] = books[key];
    }
  });

  return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));

});


// ===============================
// Get book details based on Title
// ===============================
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;
  let booksByTitle = {};
  const bookKeys = Object.keys(books);

  bookKeys.forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle[key] = books[key];
    }
  });

  return res.status(200).send(JSON.stringify(booksByTitle, null, 4));

});


// ===============================
// Get book review
// ===============================
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

});


module.exports.general = public_users;