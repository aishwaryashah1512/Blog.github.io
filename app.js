//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose=require('mongoose');

mongoose.connect("mongodb+srv://blogpost:123456@crA@cluster0.gehi3.mongodb.net/blogDB",{useNewUrlParser:true, useUnifiedTopology: true });

//const blogSchema=mongoose.Schema({name:String,content:String});
const composeSchema=mongoose.Schema({title:String,content:String});
const composeCollection=new mongoose.model("composeCollection",composeSchema);

const home="Create your blog here and share your thoughts and opinion for free";

const about="This Website welcomes all bloggers across the world to type down their thoughts,ideas,emotions."
const contact="For further queries contact 89..... or blogpost@.....";
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.post("/compose",function(req,res)
{
var post={title:req.body.postTitle,body:req.body.postBody};
const compose=new composeCollection
({
  title:post.title,
  content:post.body
});
compose.save(function(err)
{
  if(!err)
  {
    res.redirect("/")
  }
});
});

app.get("/posts/:postId",function(req,res)
{
const requested=req.params.postId.substring(1);
console.log(requested);
composeCollection.findOne({_id:requested},function(err,post)
{
if(!err)
{
  res.render("post",{postname:post.title,postcontent:post.content});
}
  else {
    console.log(err);
  }
});
});

app.get("/",function(req,res)
{
  composeCollection.find({},function(err,post)
  {
  res.render("home",{homeStartingContent:home,posts:post});
});
});

app.get("/about",function(req,res)
{
  res.render("about",{aboutContent:about});
});

app.get("/contact",function(req,res)
{
  res.render("contact",{contactContent:contact});
});

app.get("/compose",function(req,res)
{
res.render("compose");
});

app.listen(3000,function()
{
  console.log("Server started on port 3000");
});
