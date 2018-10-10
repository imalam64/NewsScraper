const express = require("express");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const bodyparser = require("body-parser")


const routes = require('./router/routes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(express.static("public"));

// Setup Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/curbedScraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

//Use the routes
app.use('/', routes);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});