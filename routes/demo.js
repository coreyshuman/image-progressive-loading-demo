var express = require("express");
var router = express.Router();
var sharp = require("sharp");
var path = require("path");
const axios = require("axios");

const imageName = "hugues-de-buyer-mimeure-lQPEChtLjUo-unsplash.jpg";

/* GET home page. */
router.get("/", async function (req, res, next) {
  var imageBufferOrPath =
    path.join(__dirname, "../public/images/") + imageName;

  if (req.query.imageUrl) {
    const axiosRequest = await axios.get(req.query.imageUrl, {
      responseType: "arraybuffer",
    });
    imageBufferOrPath = axiosRequest.data;
  }

  var image = await sharp(imageBufferOrPath);
  var thumbnail = await image
    .resize(60)
    .toFormat("webp", {
      quality: 40,
      smartSubsample: true,
    })
    .toBuffer();

  thumbnail = "data:image/webp;base64," + thumbnail.toString("base64");

  var baselineImageSrc = "./demo/baseline-image";
  var progressiveImageSrc = "./demo/progressive-image";

  if (req.query.imageUrl) {
    baselineImageSrc += "?imageUrl=" + req.query.imageUrl;
    progressiveImageSrc += "?imageUrl=" + req.query.imageUrl;
  }

  res.render("demo", {
    title: "Progressive Load Demo",
    thumbnail,
    baselineImageSrc,
    progressiveImageSrc,
  });
});

router.get("/progressive-image", async function (req, res, next) {
  const mimetype = "image/jpeg";
  const filename = "progressive.jpg";

  var imageBufferOrPath =
    path.join(__dirname, "../public/images/") + imageName;

  if (req.query.imageUrl) {
    const axiosRequest = await axios.get(req.query.imageUrl, {
      responseType: "arraybuffer",
    });
    imageBufferOrPath = axiosRequest.data;
  }

  var image = await sharp(imageBufferOrPath);
  var data = await image
    .resize(700)
    .toFormat("jpeg", {
      quality: 100,
      progressive: true,
    })
    .toBuffer();

  res.writeHead(200, {
    "Content-Type": mimetype,
    "Content-disposition": "attachment;filename=" + filename,
    "Content-Length": data.length,
  });
  res.end(Buffer.from(data, "binary"));
});

router.get("/baseline-image", async function (req, res, next) {
  const mimetype = "image/jpeg";
  const filename = "baseline.jpg";

  var imageBufferOrPath =
    path.join(__dirname, "../public/images/") + imageName;

  if (req.query.imageUrl) {
    const axiosRequest = await axios.get(req.query.imageUrl, {
      responseType: "arraybuffer",
    });
    imageBufferOrPath = axiosRequest.data;
  }

  var image = await sharp(imageBufferOrPath);
  var data = await image
    .resize(700)
    .toFormat("jpeg", {
      quality: 100,
      progressive: false,
    })
    .toBuffer();

  res.writeHead(200, {
    "Content-Type": mimetype,
    "Content-disposition": "attachment;filename=" + filename,
    "Content-Length": data.length,
  });
  res.end(Buffer.from(data, "binary"));
});

module.exports = router;
