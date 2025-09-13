const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [{"username" : "test", "password": "test123"}];

const isValid = (username)=>{ //returns boolean
    if (username.length < 2) return false
    if (!/^\d/.test(username)) return false;
    return true
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

 // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send(`User successfully logged in, token is ${accessToken}`);
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//     let isbn = req.params.isbn;
//     let review = req.body.review;
//     let username = req.session.authorization.username;
//     if (books[isbn]) {
//         if (books[isbn].reviews[username]) {
//             Object.assign(books[isbn].reviews, review);
//         } else {
//             books[isbn].reviews.push({username: review});
//         }
//     }
//     return res.status(200).json({message: books[isbn]});
// });

regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.body.review;
    let username = req.session.authorization.username;

    if (books[isbn]) {
        // Add or update the review for this user
        books[isbn].reviews[username] = review;

        return res.status(200).json({ message: `Review added/updated for ISBN ${isbn}`, book: books[isbn] });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
// module.exports.autenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
