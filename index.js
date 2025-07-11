import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import crypto from 'crypto';

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// session memory
var topics = [];

// homepage
app.get("/", (req, res) => {
  res.render("index.ejs", {curTopic: topics,
                            curDir: __dirname
  });
});

// create new topic
app.get("/newTopic", (req, res) => {
  res.render("newTopic.ejs", {repeat: false});
});
app.post("/newTopic", (req, res) => {
  // check for name of topic is not new.
  var newTopic = true;
  topics.forEach((topic) => {
    if (topic.title.toLowerCase() === req.body["topic title"].toLowerCase()){
        newTopic = false;
    }
  })

  // store new topic if it's new
  if (newTopic){
    var topic = {
        title: req.body["topic title"],
        content: []
    };
    topics.push(topic);
    res.redirect("/");
  }
  // ask for another entry
  else{
    res.render("newTopic.ejs", {repeat: true});
  }
});

// entering of a topic
app.get("/:topicTitle", (req, res) => {
  const requestedTitle = req.params.topicTitle.toLowerCase().replace(/\s+/g, "");
  const foundTopic = topics.find(topic => topic.title.toLowerCase().replace(/\s+/g, "") === requestedTitle);

  if (foundTopic) {
    res.render("topic.ejs", { topic: foundTopic });
  } else {
    res.status(404).send("Post not found");
  }
});

// topic deletion
app.post("/deleteTopic", (req, res) => {
    topics = topics.filter(topic => topic.title.replace(/\s+/g, "") !== req.body["title"].replace(/\s+/g, ""));
    res.redirect("/");
})

// topic edition
app.post("/editTopic", (req, res) => {
    res.render("editTopic.ejs", {repeat: false,
                                oldTopic: topics.find(topic => topic.title.toLowerCase().replace(/\s+/g, "") === (req.body["topicTitle"]).toLowerCase().replace(/\s+/g, ""))
    });
})
app.post("/:topicTitle", (req, res) => {
  const requestedTitle = req.params.topicTitle.toLowerCase().replace(/\s+/g, "");
  const foundTopic = topics.find(topic => topic.title.toLowerCase().replace(/\s+/g, "") === requestedTitle);

  if (foundTopic) {
    foundTopic.title = req.body["newTitle"];
    res.render("topic.ejs", { topic: foundTopic });
  } else {
    res.status(404).send("Post not found");
  }
});

// artical creation
app.get("/:topic/newArtical", (req, res) => {
    res.render("newArtical.ejs", {curTopic: req.params.topic.toLowerCase().replace(/\s+/g, "")});
});
app.post("/:topic/newArtical", (req, res) => {
    const curTopic = topics.find(topic => topic.title.toLowerCase().replace(/\s+/g, "") === (req.params.topic.toLowerCase()).toLowerCase().replace(/\s+/g, ""))
    var artical = {
        title: req.body["title"],
        content: req.body["content"],
        id: crypto.randomUUID()
    };
    curTopic.content.push(artical);
    res.redirect("/"+req.params.topic.replace(/\s+/g, ""));
});

// entering of a topic
app.get("/:topicTitle/:articalTitle", (req, res) => {
  const requestedTopic = req.params.topicTitle.toLowerCase().replace(/\s+/g, "");
  const requestedArtical = req.params.articalTitle.toLowerCase().replace(/\s+/g, "");
  const foundTopic = topics.find(topic => topic.title.toLowerCase().replace(/\s+/g, "") === requestedTopic);

  if (foundTopic) {
    const foundArtical = foundTopic.content.find(artical => artical.title.toLowerCase().replace(/\s+/g, "") === requestedArtical);
    if (foundArtical){
        res.render("artical.ejs", {artical: foundArtical});
    }
    else{
        res.status(404).send("artical not found");
    }
  } 
  else {
    res.status(404).send("topic not found");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});