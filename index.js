import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
  const requestedTitle = req.params.topicTitle.toLowerCase();
  const foundTopic = topics.find(topic => topic.title.toLowerCase() === requestedTitle);

  if (foundTopic) {
    res.render("topic.ejs", { topic: foundTopic });
  } else {
    res.status(404).send("Post not found");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});