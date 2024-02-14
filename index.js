const express = require("express");
const app = express();
const Joi = require("joi");
const { MongoClient, ServerApiVersion } = require("mongodb");

let db;
const uri =
  "mongodb+srv://callapezmaria:sR7gCeX34slffdY6@cluster0.pwc94hu.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);
//database name
const dbName = "myProject";

app.use(express.json());

// post schema, validar
const postSchema = Joi.object({
  name: Joi.string().min(5).required(),
  description: Joi.string().min(10).required(),
});

//implement endpoint to create a subredit/community https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/ https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions
app.post("/subredits", async (req, res) => {
  const { error, value } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }
  try {
    const subredits = db.collection("subredits");
    await subredits.insertOne({
      name: value.name,
      description: value.description,
    });
    res
      .status(201)
      .json({ message: "Subredits collection created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//connection url

async function start(app) {
  //use conect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  db = client.db(dbName);

  // the following code examples can be pasted here...
  app.listen(3000, () => {
    console.log("server is running (express)");
  });

  /* const insertResult = await collection.insertMany([
    { a: 1 },
    { a: 2 },
    { a: 3 },
  ]);
  console.log("Inserted documents =>", insertResult);
} */
}
start(app)
  .then(() => console.log("start routine complete"))
  .catch((err) => console.log("star routine error: ", err));
