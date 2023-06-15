const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");
const routes = require("./routes.js");

const app = express();

app.use(cors({origin: true}));
app.use(routes);
app.use(express.json());

app.listen(5000, () => {
  console.log("API is Running on Port 5000!");
});

app.get("/", async (req, res) => {
  res.send("bisa");
});

exports.vistique = functions
    .region("asia-southeast2")
    .https.onRequest(app);
