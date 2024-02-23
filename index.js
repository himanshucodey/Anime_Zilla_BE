const express = require('express');
const cors = require("cors");
const connectDB = require('./DB/db');
const Movie = require('./schema/movies.model');
const User = require("./schema/user.model");
const Review = require("./schema/review.model")
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
        const data = await Movie.find({});
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
                return res.status(200).json({ message: "User register sucessfully" });
            }
            else {
                return res.status(400).json({ message: "User already exist" });
            }
        }
        else {
            return res.status(400).json({ message: "All fields are required" });
        }
    } catch (error) {
        res.status(400).json({ error: error });
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
        return res.status(200).json({ message: "Login successfully", user });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// Add review for specific movie
app.post('/movies/:movieId', async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const reviewData = req.body;

        const existingReview = await Review.findOne({movie: movieId, user: reviewData.user})
        if(existingReview){
            return res.status(400).json({error: "You have already added a review"});
        }

        const review = new Review({
            movie: movieId,
            user: reviewData.user,
            rating: reviewData.rating,
            comment: reviewData.comment
        });

        const savedReview = await review.save();

        const updatedMovie = await Movie.findByIdAndUpdate(movieId, { $push: { review: savedReview._id } }, { new: true });

        return res.status(201).json(updatedMovie);
    } catch (error) {
        console.error('Error adding review:', error);
        return res.status(500).json({ error: 'Failed to add review.' });
    }
});

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})