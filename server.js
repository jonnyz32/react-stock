import express from 'express';
import path from 'path';
const app = express();
const __dirname = path.resolve();

// import sslRedirect from 'heroku-ssl-redirect';



// app.use(sslRedirect())
// app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname));



app.get('/*', function(req,res) {
    console.log("sending file: ", __dirname+ "/index.html")
res.sendFile(path.join(__dirname+
'/index.html'));});
const port = process.env.PORT || 8080
app.listen(port, ()=>{
  console.log(`Listening on port ${port}`)
});