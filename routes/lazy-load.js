var express = require("express");
var router = express.Router();
var sharp = require("sharp");
var path = require("path");

const imageName = "hugues-de-buyer-mimeure-lQPEChtLjUo-unsplash-small.jpg";




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

  res.render("lazy", {
    title: req.query.slow ? "Regular Load Demo" : "Lazy Load Demo",
    thumbnail,
    useLazy: !req.query.slow
  });
});

router.get("/image", async function (req, res, next) {
  const mimetype = "image/jpeg";
  const filename = "future.jpeg";

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
    .resize(400)
    .toFormat("jpeg", {
      quality: 100,
      progressive: true
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