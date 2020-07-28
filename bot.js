var Twit = require("twit");
var config = require("./config.js");
var T = new Twit(config);
var fs = require("fs");
var images = require("./images.js");
var path = require("path");

var stream = T.stream("statuses/filter", { track: "@gatitos_bot" });
console.log("---------- PRENDO STREAM ----------");
stream.on("tweet", cargar_imagenes);

function cargar_imagenes(tweet) {
  console.log("---------- LEO IMÁGENES ----------");

  fs.readdir(__dirname + "/images", function (err, files) {
    if (err) {
      console.log(err);
    } else {
      var images = [];
      files.forEach(function (f) {
        images.push(f);
      });
      console.log("---------- SUBO IMÁGENES ----------");
      upload_random_image(images, tweet);
    }
  });
}

function upload_random_image(images, tweet) {
  console.log("---------- CARGO PARAMETROS ----------");

  var twtw = JSON.stringify(tweet);
  console.log(twtw);

  var reply_to = tweet.in_reply_to_screen_name;
  console.log(reply_to);
  var name = tweet.user.screen_name;
  console.log(name);

  var id = tweet.id_str;

  console.log("---------- OBTENGO IMAGEN RANDOM ----------");

  var random = random_from_array(images);
  console.log(random);
  var image_path = path.join(__dirname, "/images/" + random);
  console.log(image_path);
  var b64content = fs.readFileSync(image_path, { encoding: "base64" });
  console.log("---------- IMAGEN RANDOM OK ----------");
  console.log("---------- SUBO IMAGEN RANDOM ----------");

  T.post("media/upload", { media_data: b64content }, uploaded);

  console.log("---------- PREPARO TWIT ----------");

  function uploaded(err, data, response) {
    var mediaIdStr = data.media_id_string;
    var params = {
      status: "@" + name + "",
      in_reply_to_status_id: id,
      media_ids: [mediaIdStr],
    };
    console.log("voy a postear tw");

    console.log("---------- SUBO TWIT CON IMAGEN ----------");

    T.post("statuses/update", params, tweeted);
  }

  function tweeted(err, reply) {
    if (err) {
      console.log("---------- ERROR ----------");
      console.log(err.message);
    } else {
      console.log("---------- EXITO ----------");
      console.log("Tweeted: " + reply.text);
    }
  }
}

function random_from_array(images) {
  console.log("---------- DEVUELVO VALOR RANDOM DE ARRAY ----------");
  return images[Math.floor(Math.random() * images.length)];
}
