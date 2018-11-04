var db = require("../models");
var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");

router.get("/", function(req, res) {
    db.Article.find({}).then(function(results){
        console.log(results);
        if (results.length > 1){
            res.render("index", {articles:results});
        }else {
            res.render("index");
        }
    }).catch(function(err){
        console.log(err);
        return res.json({error:"error!"});
    });
});

router.get("/scrape", function(req, res) {
  axios.get("http://www.theonion.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("header a").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .text();
      result.para = $(this)
        .children("p")
        .text();
      result.link = $(this)
        .attr("href");
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
  });
});

router.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.post("/articles/:id", function(req, res) {
  
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});
module.exports = router;