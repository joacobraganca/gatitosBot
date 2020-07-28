//@ts-check


var Twit = require('twit');

var config = require('./config.js');
var T = new Twit(config);

var fs = require('fs');
var images = require("./images.js");
var path = require('path');

var stream = T.stream('statuses/filter', { track: '@gatitos_bot' });
console.log("---------- PRENDO STREAM ----------");
stream.on('tweet', cargar_imagenes);

function cargar_imagenes(tweet) {
    console.log("---------- LEO IMÁGENES ----------");

    fs.readdir(__dirname + '/images', function (err, files) {
        if (err) {
            console.log(err);
        }
        else {
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

    // var id = tweet.id_str;
    var id = tweet.id_str;

    console.log("---------- OBTENGO IMAGEN RANDOM ----------");

    var random = random_from_array(images);
    console.log(random);
    var image_path = path.join(__dirname, '/images/' + random);
    console.log(image_path);
    var b64content = fs.readFileSync(image_path, { encoding: 'base64' });
    console.log("---------- IMAGEN RANDOM OK ----------");
    console.log("---------- SUBO IMAGEN RANDOM ----------");

    T.post('media/upload', { media_data: b64content }, uploaded);

    console.log("---------- PREPARO TWIT ----------");

    function uploaded(err, data, response) {
        var mediaIdStr = data.media_id_string;
        var params = {
            status: '@' + name + '',
            in_reply_to_status_id: id,
            media_ids: [mediaIdStr]
        }
        console.log("voy a postear tw");

        console.log("---------- SUBO TWIT CON IMAGEN ----------");

        T.post('statuses/update', params, tweeted);
        
    };

    // T.post('statuses/update', { status: replyText, in_reply_to_status_id: id }, tweeted);

    function tweeted(err, reply) {
        if (err) {
            console.log("---------- ERROR ----------");
            console.log(err.message);
        } else {
            console.log("---------- EXITO ----------");
            console.log('Tweeted: ' + reply.text);
        }
    }
}

function random_from_array(images) {
    console.log("---------- DEVUELVO VALOR RANDOM DE ARRAY ----------");
    return images[Math.floor(Math.random() * images.length)];
}






















// var Twit = require('twit');

// var config = require('./config.js');
// var T = new Twit(config);

// var fs = require('fs');
// var images = require("./images.js");
// var path = require('path');

// var stream = T.stream('statuses/filter', { track: '@gatitos_bot' });
// console.log("---------- PRENDO STREAM ----------");
// stream.on('tweet', responderTweet);

// console.log("---------- SETTEO INTERVALO 30 MIN ----------");
// setInterval(function () {
//     console.log("---------- ENTRO A TWEETEAR ----------");
//     // var images = cargarImagenes();
//     fs.readdir(__dirname + '\images', function (err, files) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             var images = [];
//             files.forEach(function (f) {
//                 console.log("---------- CARGO IMAGEN EN ARRAY ----------");
//                 images.push(f);
//             });
//             console.log("---------- IMAGENES EN ARRAY ----------");
//             tweetCadaMediaHora(images);
//             // return images;
//         }
//     });
// }, 1800000);

// function tweetCadaMediaHora(images) {
//     console.log("---------- COMIENZO A HACER EL TWEET ----------");
//     var image_path = obtengoImagenRandom(images);
//     console.log("---------- PATH RANDOM OBTENIDO ----------");

//     var b64content = fs.readFileSync(image_path, { encoding: 'base64' });
//     console.log("---------- SE CODIFICA PATH A B64 ----------");

//     console.log("---------- PONGO A PUBLICAR TWEET ----------");
//     T.post('media/upload', { media_data: b64content }, subirTweetMediaHora);
// }

// // cargo las imagenes en el array
// function cargarImagenes() {
//     console.log("---------- COMIENZO A CARGAR IMAGENES EN ARRAY ----------");
//     fs.readdir(__dirname + '\images', function (err, files) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             var images = [];
//             files.forEach(function (f) {
//                 console.log("---------- CARGO IMAGEN EN ARRAY ----------");
//                 images.push(f);
//             });
//             console.log("---------- IMAGENES EN ARRAY ----------");
//             return images;
//         }
//     });
// }

// // obtengo el path de la imagen random
// function obtengoImagenRandom(images) {
//     console.log("---------- COMINEZO A OBTENER EL PATH RANDOM ----------");
//     var random = random_from_array(images);
//     console.log(random);
//     var image_path = path.join(__dirname, '/images/' + random);
//     console.log(image_path);
//     return image_path;
// }

// function subirTweetMediaHora(err, data, response) {
//     console.log("---------- SETEO PARAMETROS DE TWEET ----------");
//     var mediaIdStr = data.media_id_string;
//     var params = {
//         media_ids: [mediaIdStr]
//     }
//     console.log("---------- SE SUBE EL TWEET ----------");
//     T.post('statuses/update', params, tweeted);
// }

// function responderTweet(tweet) {
//     console.log("---------- COMIENZO A RESPONDER TWEET ----------");
//     console.log("---------- CARGO LAS IMAGENES ----------");

//     // var images = cargarImagenes();
//     var images = [];
//     console.log("---------- COMIENZO A CARGAR IMAGENES EN ARRAY ----------");
//     fs.readdir(__dirname + '\images', function (err, files) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             files.forEach(function (f) {
//                 console.log("---------- CARGO IMAGEN EN ARRAY ----------");
//                 images.push(f);
//             });
//             console.log("---------- IMAGENES EN ARRAY ----------");
//         }
//     });
//     console.log("---------- IMAGENES CARGADAS ----------");

//     var reply_to = tweet.in_reply_to_screen_name;
//     var name = tweet.user.screen_name;
//     var id = tweet.id_str;

//     var image_path = obtengoImagenRandom(images);
//     console.log("---------- RANDOM PATH OBTENIDO ----------");

//     var b64content = fs.readFileSync(image_path, { encoding: 'base64' });
//     console.log("---------- SE CODIFICA EL PATH EN B64 ----------");
//     console.log("---------- COMIENZO A SUBIR RESPUESTA ----------");

//     T.post('media/upload', { media_data: b64content }, subirTweetRespuesta);

//     function subirTweetRespuesta(err, data, response) {
//         console.log("---------- SETEO LOS PARAMETROS DE LA RESPUESTA ----------");
//         var mediaIdStr = data.media_id_string;
//         var params = {
//             status: '@' + name + '',
//             in_reply_to_status_id: id,
//             media_ids: [mediaIdStr]
//         }
//         console.log("---------- SUBO RESPUESTA CON IMAGEN ----------");
//         T.post('statuses/update', params, tweeted);
//     }
// }

// function tweeted(err, reply) {
//     if (err) {
//         console.log("---------- ERROR ----------");
//         console.log(err.message);
//     } else {
//         console.log("---------- EXITO ----------");
//         console.log('Tweeted: ' + reply.text);
//     }
// }

// function random_from_array(images) {
//     console.log("---------- DEVUELVO VALOR RANDOM DE ARRAY ----------");
//     return images[Math.floor(Math.random() * images.length)];
// }








