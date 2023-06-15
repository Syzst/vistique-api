/* eslint-disable new-cap */
/* eslint-disable max-len */

const express = require("express");
const admin = require("firebase-admin");
const multer = require("multer");
const imageUpload = require("./imageUpload.js");

const serviceAccount = require("../../serviceAccount/capstone-project-vistique-firebase-adminsdk-3cbcs-39819a3095.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  ignoreUndefinedProperties: true,
});

const router = express.Router();
const db = admin.firestore();
const upload = multer({storage: multer.memoryStorage()}).single("photo");

// ------------------------ USER DATA ------------------------
{
  // Create new User
  router.post("/user", async (req, res) => {
    const {
      user_name,
      user_email,
      user_photoUrl,
    } = req.body;

    try {
      const user = {
        user_name,
        user_email,
        user_photoUrl,
      };
      const docRef = await db.collection("users").add(user);
      res.status(201).send({message: "User Added!", user_id: docRef.id});
    } catch (error) {
      console.error("Error adding user:", error);
      res.status(500).send("Error adding user");
    }
  });

  // Read all Users
  router.get("/users", async (req, res) => {
    const snapshot = await db.collection("users").get();

    const users = [];
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();

      users.push({id, ...data});
    });
    res.status(200).send(JSON.stringify(users));
  });

  // Read User by ID
  router.get("/user/:id", async (req, res) => {
    const snapshot = await db.collection("users")
        .doc(req.params.id).get();

    const userId = snapshot.id;
    const userData = snapshot.data();

    res.status(200).send(JSON.stringify({id: userId, ...userData}));
  });

  // Update User by ID
  router.put("/user/:id", async (req, res) => {
    const body = req.body;

    await db.collection("users").doc(req.params.id).update(body);

    res.status(200).send("Successfully Updating user");
  });

  // Delete User by id
  router.delete("/user/:id", async (req, res) => {
    await admin.firestore().collection("users").doc(req.params.id).delete();

    res.status(200).send("Successfully Deleting user");
  });
}

// ------------------------ POPULAR BATIK DATA ------------------------
{
  // Create new Popular Batik
  router.post("/pbatik", upload, imageUpload.uploadToGcs("predict"), async (req, res) => {
    let pbatik_photoUrl = "";

    if (req.file && req.file.cloudStoragePublicUrl) {
      pbatik_photoUrl = req.file.cloudStoragePublicUrl;
    }

    const {
      pbatik_name,
      pbatik_price,
      pbatik_description,
      pbatik_history,
    } = req.body;

    try {
      const pbatik = {
        pbatik_name,
        pbatik_price,
        pbatik_description,
        pbatik_history,
        pbatik_photoUrl,
      };
      const docRef = await db.collection("pbatiks").add(pbatik);
      res.status(201).send({message: "Popular Batik Added!", pbatik_id: docRef.id});
    } catch (error) {
      console.error("Error adding popular batik:", error);
      res.status(500).send("Error adding popular batik");
    }
  });

  // Read all Popular Batik
  router.get("/pbatiks", async (req, res) => {
    const snapshot = await db.collection("pbatiks").get();

    const pbatiks = [];
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();

      pbatiks.push({id, ...data});
    });
    res.status(200).send(JSON.stringify(pbatiks));
  });

  // Read Popular Batik by ID
  router.get("/pbatik/:id", async (req, res) => {
    const snapshot = await db.collection("pbatiks")
        .doc(req.params.id).get();

    const pbatikId = snapshot.id;
    const pbatikData = snapshot.data();

    res.status(200).send(JSON.stringify({id: pbatikId, ...pbatikData}));
  });

  // Update Popular Batik by ID
  router.put("/pbatik/:id", async (req, res) => {
    const body = req.body;

    await db.collection("pbatiks").doc(req.params.id).update(body);

    res.status(200).send("Successfully Updating Popular Batik");
  });

  // Delete Popular Batik by id
  router.delete("/pbatik/:id", async (req, res) => {
    await admin.firestore().collection("pbatiks").doc(req.params.id).delete();

    res.status(200).send("Successfully Deleting Popular Batik");
  });
}

// ------------------------ BATIK DATA ------------------------
{
  // Create new Batik
  router.post("/batik", async (req, res) => {
    const {
      batik_name,
      batik_price,
      batik_description,
      batik_history,
      batik_photo,
    } = req.body;

    try {
      const batik = {
        batik_name,
        batik_price,
        batik_description,
        batik_history,
        batik_photo,
      };
      const docRef = await db.collection("batiks").add(batik);
      res.status(201).send({message: "Batik Added!", batik_id: docRef.id});
    } catch (error) {
      console.error("Error adding batik:", error);
      res.status(500).send("Error adding batik");
    }
  });

  // Read all Batik
  router.get("/batiks", async (req, res) => {
    const snapshot = await db.collection("batiks").get();

    const batiks = [];
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();

      batiks.push({id, ...data});
    });
    res.status(200).send(JSON.stringify(batiks));
  });

  // Read Batik by ID
  router.get("/batik/:id", async (req, res) => {
    const snapshot = await db.collection("batiks")
        .doc(req.params.id).get();

    const batikId = snapshot.id;
    const batikData = snapshot.data();

    res.status(200).send(JSON.stringify({id: batikId, ...batikData}));
  });

  // Update Batik by ID
  router.put("/batik/:id", async (req, res) => {
    const body = req.body;

    await db.collection("batiks").doc(req.params.id).update(body);

    res.status(200).send("Successfully Updating Batik");
  });

  // Delete Batik by id
  router.delete("/batik/:id", async (req, res) => {
    await admin.firestore().collection("batiks").doc(req.params.id).delete();

    res.status(200).send("Successfully Deleting Batik");
  });
}

// ------------------------ ARTICLES DATA ------------------------
{
  // Create new Article
  router.post("/article", async (req, res) => {
    const {
      article_title,
      article_description,
      article_photo,
      article_link,
    } = req.body;

    try {
      const article = {
        article_title,
        article_description,
        article_photo,
        article_link,
      };
      const docRef = await db.collection("articles").add(article);
      res.status(201).send({message: "Article Added!", article_id: docRef.id});
    } catch (error) {
      console.error("Error adding article:", error);
      res.status(500).send("Error adding article");
    }
  });

  // Read all Article
  router.get("/articles", async (req, res) => {
    const snapshot = await db.collection("articles").get();

    const articles = [];
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();

      articles.push({id, ...data});
    });
    res.status(200).send(JSON.stringify(articles));
  });

  // Read Article by ID
  router.get("/article/:id", async (req, res) => {
    const snapshot = await db.collection("articles")
        .doc(req.params.id).get();

    const articleId = snapshot.id;
    const articleData = snapshot.data();

    res.status(200).send(JSON.stringify({id: articleId, ...articleData}));
  });

  // Update Article by ID
  router.put("/article/:id", async (req, res) => {
    const body = req.body;

    await db.collection("articles").doc(req.params.id).update(body);

    res.status(200).send("Successfully Updating Article");
  });

  // Delete Article by id
  router.delete("/article/:id", async (req, res) => {
    await admin.firestore().collection("articles").doc(req.params.id).delete();

    res.status(200).send("Successfully Deleting Article");
  });
}

// ------------------------ PREDICTS DATA ------------------------
{
  // Create new Predict
  
  router.post("/predicts", upload, imageUpload.uploadToGcs("predict"), async (req, res) => {
    let predict_photoUrl = "";

    if (req.file && req.file.cloudStoragePublicUrl) {
      predict_photoUrl = req.file.cloudStoragePublicUrl;
    }

    try {
      const predict = {predict_photoUrl};

      const docRef = await db.collection("predicts").add(predict);
      res.status(201).send({message: "Predict Added", predict_id: docRef.id});
    } catch (error) {
      console.error("Error adding predict:", error);
      res.status(500).send("Error adding predict");
    }
  });
}

module.exports = router;
