const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn]));
  }else {
    return res.status(404).json({message : "Wrong isbn number, try another"});
   }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let author_books = [];
    Object.values(books).forEach(book => {
        if (book.author === author) {
            author_books.push(book);
        }
    });
    if (author_books.length > 0) {
        return res.send(JSON.stringify(author_books, null, 4))
    } else {
        return res.status(404).json({message: "Author is not found"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    title = req.params.title;
    for (const [isbn, book] of Object.entries(books)) {
        if (book.title === title) {
            return res.send(JSON.stringify({"isbn": isbn, book}, null, 4))
        }
    }
    return res.status(404).json({message: "Author is not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews));
  }else {
    return res.status(404).json({message : "Wrong isbn number, try another"});
   }
});

module.exports.general = public_users;
