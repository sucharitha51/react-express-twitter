const Twitter = require("twitter")
const dotenv = require("dotenv")
const fs = require("fs")

dotenv.config()

const twitterClient = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

const imageToUpload = fs.readFileSync('./images/flower.jpeg')

twitterClient.post('media/upload', {media: imageToUpload}, (error, media, response)=>{
    if(error){
        console.log(error)
    }else{
        const status = {
            status: 'A tweet from my Node Application',
            media_ids: media.media_id_string
        }
        twitterClient.post('status/upload', status, (error, tweet, response)=>{
            if(error){
                console.log(error)
            }else{
                console.log('Tweeted an image successfully!')
            }
        })
    }
})