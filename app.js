
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

//setting up our view engine as ejs for our templating
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

//public directory to store our static files (imgs, etc)
app.use(express.static("public"));

const url = 'mongodb://localhost:27017/wikiDB';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

//create schema for our articles collection
const articleSchema = {
  title: String,
  content: String
}

//create model
const Article = mongoose.model("Article", articleSchema)

///////////////////////////////////////////////REQUESTS TARGETTING ALL ARTICLES /////////////////////////////////////////////////
app.route("/articles")
  .get(function(req, res){
    Article.find({}, function(err, foundArticles){
      if(!err){
        res.send(foundArticles);
      } else {
        res.send(err);
      };
    });
  })

  .post(function(req, res){
    console.log();
    console.log();

  //create new const that will store new article into our mongo db based on data recieved through the post request
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

  //save this new article into the db and check for errors
    newArticle.save(function(err){
      if (!err){
        res.send("Successfully added a new article")
      } else {
        res.send(err);
      };
    });
  })

  .delete(function(req, res){
    Article.deleteMany(function(err){
      if (!err){
        res.send("Deleted all articles")
      } else {
        res.send(err);
      }
    });
  })

/////////////////////////////////////////////REQUESTS TARGETTING A SPECIFIC ARTICLE //////////////////////////////////////

app.route("/articles/:articleTitle")
  .get(function(req, res){

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
        res.send(foundArticle)
      } else {
        res.send("No articles matching that title found");
      }
    });
  })

  .put(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if (!err){
          res.send("Sucessfully updated articles")
        }
      }
    );
  })

  .patch(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article.")
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
      if (!err){
        res.send("Sucessfully deleted article")
      } else {
        res.send(err);
      }
    });
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
