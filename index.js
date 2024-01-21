const express = require('express');
const cors = require("cors");
const connectDB = require('./DB/db');
const { default: mongoose } = require('mongoose');
const Movie = require('./schema/movies.model');
const User = require("./schema/user.model")
require('dotenv').config();

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", async (req, res) => {
    try {
        const data = await Movie.find({ featured: true });
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error });
        console.log(error);
    }
});

app.get("/movies", async (req, res) => {
    try {
        const data = await Movie.find();
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error });
        console.log(error);
    }
});

// REGISTER
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (name && email && password) {
            const isUser = await User.findOne({ email });

            if (!isUser) {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                await newUser.save();
                return res.redirect("/login");
            }
            else{
                return res.status(400).json({ message: "User already exist" });
            }
        }
        else {
            return res.status(400).json({ message: "All fields are required" });
        }
    } catch (error) {
        res.status(400).json({error: error});
    };
})

// LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!(email || password)) {
        console.log("Please fill up all fields!");
    }
    if (!user) {
        return res.status(400).json({ message: "Invalid user" })
    }
    try {
        if (user.email !== email && user.password !== password) {
            console.log("Please enter correct email or password");
        }
        return res.status(200).json({message: "Login successfully"});
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// WATCH LATER
app.post("/user/:userId/watch-later/:movieId", async (req, res) => {
    const { userId, movieId } = req.params;

    try {
        const user = await User.findById(userId);
        const movie = await Movie.findById(movieId);

        if (user && movie) {
            user.watchLaterMovies.push(movie);
            await user.save();

            return res.status(200).json({ message: "Movie added to watch later" });
        } else {
            return res.status(404).json({ message: "User or movie not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// FAVORITE
app.post("/user/:userId/favorite/:movieId", async (req, res) => {
    const { userId, movieId } = req.params;

    try {
        const user = await User.findById(userId);
        const movie = await Movie.findById(movieId);

        if (user && movie) {
            user.favoriteMovies.push(movie);
            await user.save();

            return res.status(200).json({ message: "Movie added to favorites" });
        } else {
            return res.status(404).json({ message: "User or movie not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})