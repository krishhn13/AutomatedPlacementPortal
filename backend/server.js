// requiring essential modules
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;


// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
        console.log("Connected to MongoDB");
}).catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
});




// middlewares
const morgan = require('morgan');
const cors = require('cors');

app.use(morgan('tiny'));
app.use(cors());





// importing the files
const company = require("./routes/companyRoutes")






//using the routes
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use('/api',company); 



app.listen(PORT, () => {
        console.log(`Server is successfully established on http://localhost:${PORT}`);
});
