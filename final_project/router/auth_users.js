const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check if username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
}

// Check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(user => 
    user.username === username && user.password === password
  );
}

// ===================== LOGIN =====================

regd_users.post("/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {

    const accessToken = jwt.sign(
      { username: username },
      "fingerprint_customer",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({ message: "User successfully logged in" });

  } else {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

});

// ===================== ADD / MODIFY REVIEW =====================

regd_users.put("/auth/review/:isbn", (req, res) => {

  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!review) {
    return res.status(400).json({ message: "Review text required" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update review
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;