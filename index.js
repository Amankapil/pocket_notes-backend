const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

const uri = process.env.MONGODB_URI;

const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

// mongoose.connect("mongodb://localhost:27017/pocket_notes", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const GroupSchema = new mongoose.Schema({
  name: String,
  color: String,
});

const NoteSchema = new mongoose.Schema({
  groupId: mongoose.Schema.Types.ObjectId,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Group = mongoose.model("Group", GroupSchema);
const Note = mongoose.model("Note", NoteSchema);

app.post("/groups", async (req, res) => {
  const group = new Group(req.body);
  await group.save();
  res.send(group);
});

app.get("/groups", async (req, res) => {
  const groups = await Group.find();
  res.send(groups);
});

app.post("/notes", async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.send(note);
});

app.get("/notes/:groupId", async (req, res) => {
  const notes = await Note.find({ groupId: req.params.groupId });
  res.send(notes);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
