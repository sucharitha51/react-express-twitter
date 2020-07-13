const express = require('express');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const cors = require('cors')
const dotenv = require('dotenv')
const Twitter = require('twitter')
const fs = require('fs')
const app = express();

app.use(cors())
dotenv.config()

const port = process.env.PORT || 4000;
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})
let newFilename
// configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    /*
      Files will be saved in the 'uploads' directory. Make
      sure this directory already exists!
    */
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    /*
      uuidv4() will generate a random ID that we'll use for the
      new filename. We use path.extname() to get
      the extension from the original file name and add that to the new
      generated ID. These combined will create the file name used
      to save the file on the server and will be available as
      req.file.pathname in the router handler.
    */
    newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});
// create the multer instance that will be used to upload/save the file
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', upload.single('selectedFile'), (req, res) => {
  /*
    We now have a new req.file object here. At this point the file has been saved
    and the req.file.filename value will be the name returned by the
    filename() function defined in the diskStorage configuration. Other form fields
    are available here in req.body.
  */

  const imageData = fs.readFileSync("./images/" + req.file.filename) //replace with the path to your image

  client.post("media/upload", { media: imageData }, function (error, media, response) {
    if (error) {
      console.log(error)
    } else {
      const status = {
        status: req.body.description ? req.body.description : "I tweeted from Node.js!",
        media_ids: media.media_id_string
      }

      client.post("statuses/update", status, function (error, tweet, response) {
        if (error) {
          console.log(error)
        } else {
          console.log("Successfully tweeted an image!")
        }
      })
    }
  })

  res.send();
});


app.listen(port, () => console.log(`Server listening on port ${port}`));