//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title : String,
    content : String
}

const Article = mongoose.model("Article", articleSchema)
///////////////////////////////Request Targeting All Articles///////////////////////////////////////////
app.route("/articles")
.get((req, res) => {
    Article.find()
    .then(function(foundArticles) {
        res.send(foundArticles);
    })
    .catch(function(err) {
        res.send(err);
    });

})
.post((req, res) => {
    console.log(req.body.title)
    console.log(req.body.content)

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save()
    .then(function(foundArticles) {
        res.send("Successfully added a new article!");
    })
    .catch(function(err){
        res.send(err);
    });
})
.delete((req, res) => {
    Article.deleteMany()
    .then(function() {
        res.send("Succesfully deleted.")
    })
    .catch(function(err){
        res.send(err);
    });
});
///////////////////////////////////////////////Request Targetting a Specific Article////////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle})
    .then(function(foundArticle) {
        res.send(foundArticle);
    })
    .catch(function(err) {
        res.send("No articles matching that title was found.");
    });
})
.put(function(req, res) {
    Article.updateOne({title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content})
    .then(function(updateResult) {
        if (updateResult.n > 0) {
            res.send("Succesfully updated.");
        } else {
            res.status(404).send("No articles matching that title was found.");
        }
    })
    .catch(function(err) {
        res.status(500).send("Error while updating article.");
    });
})
.patch(function(req, res) {
    Article.updateOne({title:req.params.articleTitle},
        {$set: req.body})
        .then(function(){
            res.send("Succesfully updated.")
        })
        .catch(function(err) {
            res.send(err);
        })
})
.delete(function(req, res) {
    Article.deleteOne({title:req.params.articleTitle})
    .then(function() {
        res.send("Succesfully deleted.")
    })
    .catch(function(err) {
        res.send(err);
    })
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});