import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// session memory
var topics = [];

// homepage
app.get("/", (req, res) => {
  res.render("index.ejs", {curTopic: topics});
});

// create new topic
app.get("/newTopic", (req, res) => {
  res.render("newTopic.ejs");
});
app.post("/newTopic", (req, res) => {
  var topic = {
    title: req.body["topic title"],
    content: []
  };
  topics.push(topic);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});