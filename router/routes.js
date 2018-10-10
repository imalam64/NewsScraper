const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const routes = express.Router();

//Require Database models
const db = require("../models");


// Routes
// A GET route for scraping the LA Curbed website
routes.get("/", function(req, res) {
    const articles = [];
    axios.get("https://la.curbed.com/").then(function(response) {
      const $ = cheerio.load(response.data);
      $(".c-entry-box--compact--article").each(function(i, element) {
        // Save an empty result object
        const result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("div").children("h2")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            articles.push(result)
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
  
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.redirect('/articles');
    });
});
  
// Route for getting all Articles from the db
//this route renders the articles to the page
//using home.handlebars template
routes.get('/articles', function(req, res) {
    db.Article.find({}, function(error, data) {
      if (error) {
        res.sendStatus(404);
      } else {
        // console.log(data);
        res.render('home', {articles: data});
      }
    });
  });
  
//update an article document
//adds new comments
routes.put('/articles/:id', function(req, res) {
console.log(req.body);
db.Article.updateOne(
    {
    _id: req.params.id
    },
    { $push: {'comments' : {
        name: req.body.name,
        body: req.body.body,
    }
    }}, 
    function(error, data) {
    if (error) {
        res.sendStatus(404);
    } else {
        console.log('back to the client');
        res.sendStatus(200);
    }
});
});

module.exports = routes;