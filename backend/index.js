require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;


// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
})
.then(() => {
        console.log("Connected to MongoDB");
})
.catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
});

app.listen(PORT, () => {
        console.log(`Server is successfully established on http://localhost:${PORT}`);
});
