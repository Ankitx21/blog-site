//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));

const postsSchema = new Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postsSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", async function(req, res){
  try{
   const allPost = await Post.find({})
   console.log(allPost);
      res.render("home", {
        startingContent: homeStartingContent,
        posts: allPost
        });
  }catch(error){
    console.log("error in posting",error.message)
  }

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  async function post() {
    try {
      const newPost = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
      });
  
     const blogPost = await newPost.save();
     console.log(blogPost);

     
  res.redirect("/");
   
    } catch (error) {
      console.log("Error loading", error.message);
    } 
  }
  
  post();


});


app.get("/posts/:postId", async function(req, res){
  try {
    const requestedId = req.params.postId; // Use "postId" instead of "postName"

    // Use Mongoose to find the post by ID
    const foundPost = await Post.findById(requestedId);

    if (foundPost) {
      res.render("post", {
        title: foundPost.title,
        content: foundPost.content,
        _id: foundPost._id
      });
    } else {
      res.send("Post not found");
    }
  } catch (error) {
    console.log(error.message);
    res.send("Error fetching post");
  }
});

app.post("/delete",async function(req,res){
    const postIdDelete = req.body.postId;
    console.log(postIdDelete);
    try{
      await Post.findByIdAndRemove(postIdDelete);
      res.redirect("/");
    }catch(error){
      console.log("Id not delete please check",error.message)
    }
})


process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
