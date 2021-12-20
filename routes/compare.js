var express = require("express");
var router = express.Router();
var sharp = require("sharp");
var path = require("path");

const imageName = "hugues-de-buyer-mimeure-lQPEChtLjUo-unsplash-small.jpg";

const configs = [{
    type: "png",
    size: 20,
    formats: [{
      progressive: false,
      adaptiveFiltering: true,
      compressionLevel: 9
    }, {
      progressive: true,
      adaptiveFiltering: true,
      compressionLevel: 6
    }, {
      progressive: false,
      adaptiveFiltering: true,
      compressionLevel: 2
    }],
  },
  {
    type: "jpeg",
    size: 20,
    formats: [{
        quality: 60,
        chromaSubsampling: "4:2:0",
      },
      {
        quality: 20,
        chromaSubsampling: "4:2:0",
      },
      {
        quality: 30,
        chromaSubsampling: "4:4:4",
      },
    ],
  },
  {
    type: "webp",
    size: 20,
    formats: [{
        quality: 50
      },
      {
        quality: 50,
        smartSubsample: true
      },
      {
        quality: 40,
        smartSubsample: true
      },
    ],
  },
];

/* GET home page. */
router.get("/", async function (req, res, next) {
  var imagePath = path.join(__dirname, "../public/images/") + imageName;
  var fs = require("fs");
  var {
    size
  } = fs.statSync(imagePath);
  size = size / 1024;
  var image = await sharp(imagePath);

  var medImage = await image
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
      var outputImage = await image
        .resize(currentConfig.size)
        .toFormat(currentConfig.type, currentFormat)
        .toBuffer();

      var outputSize = outputImage.length / 1024;
      outputImage =
        `data:image/${currentConfig.type};base64,` +
        outputImage.toString("base64");
      
      if(!currentFormat.string)
        currentFormat.string = JSON.stringify(currentFormat);
      currentFormat.outputImage = outputImage;
      currentFormat.outputSize = outputSize;
    }
  }

  var medImageSize = medImage.length / 1024;
  medImage = "data:image/jpeg;base64," + medImage.toString("base64");

  res.render("compare", {
    title: "Image Resize Comparisons",
    size,
    fullImage: `/images/${imageName}`,
    medImage,
    medImageSize,
    configs,
  });
});

module.exports = router;