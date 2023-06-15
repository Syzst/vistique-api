/* eslint-disable require-jsdoc */
/* eslint-disable max-len */

"use strict";
const { Storage } = require("@google-cloud/storage");
///const fs = require("fs");
const { format } = require("date-fns");
const path = require("path");

const pathKey = path.resolve("../../serviceAccount/capstone-project-vistique-firebase-adminsdk-3cbcs-39819a3095.json");

// TODO: Sesuaikan konfigurasi Storage
const gcs = new Storage({
  projectId: "capstone-project-vistique",
  keyFilename: pathKey,
});

// TODO: Tambahkan nama bucket yang digunakan
const bucketName = "capstone-project-vistique";
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
  return "https://storage.googleapis.com/" + bucketName + "/" + filename;
}

const ImgUpload = {};

ImgUpload.uploadToGcs = (foldername) => (req, res, next) => {
  if (!req.file) return next();

  const currentDate = new Date();
  const gcsname = foldername + "/" + format(currentDate, "yyyyMMdd-HHmmss") + "-" + req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on("error", (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on("finish", () => {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  stream.end(req.file.buffer);
};

module.exports = ImgUpload;
