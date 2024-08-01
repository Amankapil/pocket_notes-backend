const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

const uri = process.env.MONGODB_URI;

const { MongoClient, ServerApiVersion } = require("mongodb");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
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
