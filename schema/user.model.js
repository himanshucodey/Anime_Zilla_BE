// user.model.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    watchedMovies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }],
    favoriteMovies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }],
    watchLaterMovies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
