var express = require("express");
var router = express.Router();
var sharp = require("sharp");
var path = require("path");
const fileUpload = require('express-fileupload');

const imageName = "hugues-de-buyer-mimeure-lQPEChtLjUo-unsplash-small.jpg";

router.use(fileUpload({
  createParentPath: true
}));

const configs = [{
    type: "png",
    formats: [{
      progressive: false,
      adaptiveFiltering: true,
      compressionLevel: 9
    }],
  },
  {
    type: "jpeg",
    formats: [{
      quality: 50,
      chromaSubsampling: "4:2:0",
    }],
  },
  {
    type: "webp",
    formats: [{
      quality: 50,
      smartSubsample: true
    }],
  },
];

router.get("/", async function (req, res, next) {
  res.render("index", {title: "Image Resizer"});
});


router.post("/", async function (req, res, next) {
  try {
    const originalImage = req.files?.imageupload;

    if(!originalImage) {
      throw new Error("No image selected.");
    }

    const size = originalImage.size / 1024;
    var image = await sharp(originalImage.data);

    const medImage = await image
      .resize(400)
      .toFormat("jpeg", {
        quality: 70
      })
      .toBuffer();

    var configIdx = 0;
    var formatIdx = 0;

    for (configIdx = 0; configIdx < configs.length; configIdx++) {
      var currentConfig = configs[configIdx];
      
      for (formatIdx = 0; formatIdx < currentConfig.formats.length; formatIdx++) {
        var currentFormat = currentConfig.formats[formatIdx];
        if(currentConfig.type === 'png') {
          currentFormat.compressionLevel = (100 - req.body.quality) / 10;
        } else {
          currentFormat.quality = Number(req.body.quality);
        }
        var outputImage = await image
          .resize(Number(req.body.width))
          .toFormat(currentConfig.type, currentFormat)
          .toBuffer();

        var outputSize = outputImage.length / 1024;
        outputImage =
          `data:image/${currentConfig.type};base64,` +
          outputImage.toString("base64");
        
        currentFormat.string = undefined;
        currentFormat.outputImage = undefined;
        currentFormat.outputSize = undefined;
        currentFormat.string = JSON.stringify(currentFormat);
        currentFormat.outputImage = outputImage;
        currentFormat.outputSize = outputSize;
      }
    }

    var medImageSize = medImage.length / 1024;
    const medImageString = "data:image/jpeg;base64," + medImage.toString("base64");
    const fullImageString = "data:image/jpeg;base64," + originalImage.data.toString("base64");

    res.render("converted", {
      title: "Converted Image",
      size,
      fullImage: fullImageString,
      medImage: medImageString,
      medImageSize,
      configs,
    });
  } catch(err) {
    res.render("index", {
      title: 'Image Resizer',
      message: 'An error occurred:' + err.message
    });
  }
});

module.exports = router;