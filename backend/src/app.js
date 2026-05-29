const express = require("express");
const multer = require("multer");
const uploadFile = require("./service/storage.service");
const postModel = require("./model/postModel");
const cors = require('cors')

const app = express()
app.use(express.json());
app.use(cors())// middleware

const upload = multer({storage: multer.memoryStorage()}) 
 //upload is a var
app.post('/createpost', upload.single("image"), async(req , res)=>{
   
const result = await uploadFile(req.file.buffer);
  const post = await postModel.create({
    image: result.url,
    caption: req.body.caption
  })
 return res.status(201).json({
    message:"upload successfully",
    post
  })
})
app.get('/getpost', async(req , res)=>{
 const posts = await postModel.find()

 return res.status(200).json({
    message:"posts fetched successfully!",
    posts
 })
})

module.exports = app;