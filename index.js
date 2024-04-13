require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser")
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
let random;
let submittedUrl;
// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  submittedUrl = req.body.url;
  if(submittedUrl.includes("https://www") && submittedUrl.includes(".com/")){
    random = Math.floor(Math.random()*9999);
    res.json({"original_url":`${submittedUrl}`,"short_url":random});

  }else{
    res.json({ error: 'invalid url' });
  }

  
});
app.get("/api/shorturl/:code",(req,res)=>{
  let code = parseInt(req.params.code);
  if(code==random){
    res.redirect(submittedUrl)
  }
  else{
    res.json({"error":"No short URL found for the given input"});
  }
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
