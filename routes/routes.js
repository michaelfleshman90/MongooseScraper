var db = require("../models");
var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");

router.get("/favicon.ico", function(req, res){
  res.status(204);
});

router.get("/", function(req, res) {
    db.Article.find({}).then(function(results){
        //console.log(results);
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
    var links = [];
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
        if (result.link == "" || result.link == "#" || links.indexOf(result.link) != -1){
          return;
        }
        links.push(result.link);
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.redirect("/");
        });
    });
    res.redirect("/");
  });
});
router.post("/savenew", function (req, res) {
  db.Saved.find(req.body).then(function(data){
    if (data.length > 0){
      return res.json(data);
    }
    db.Saved.create(req.body).then(function(dbArticle){
      res.json(dbArticle);
    }).catch(function(err){
      res.json(err);
    });
  });
});
router.get("/saved", function (req, res){
  db.Saved.find({}).then(function(results){
    if (results.length > 1){
      res.render("saved", {articles:results});
    } else {
      res.render("saved");
    }
  }).catch(function(err){
    res.render("saved");
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
router.get("/delete/:id", function(req, res){
  db.Saved.remoce({ id: req.params.id },function(err){
    if (err){
      return res.json({error: err.message});
    }
    res.json({complete: "complete"});
  });
});
router.get("/cleararticles", function(req, res){
  db.Article.remove({}, function(data){
    res.redirect("/");
  }).catch(function(err){
    res.json({error:err.message});
  });
});
router.get("/clearsaved", function(req, res){
  db.Saved.remove({}, function(data){
    res.redirect("/saved");
  }).catch(function(err){
    res.json({error:err.message});
  });
});
module.exports = router;