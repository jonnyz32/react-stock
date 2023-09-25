import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import cors from 'cors';
const app = express();
const __dirname = path.resolve();

app.use(cors({
    origin: ['http://localhost:4173', 'http://localhost:5173', 'https://stockwatchlist11-99d22e9d340f.herokuapp.com/']
  }))

// import sslRedirect from 'heroku-ssl-redirect';

function getCurrentTimestamp() {
    return Math.floor(new Date().getTime() / 1000); // Current timestamp in seconds
  }
  
  function getTimestampTwentyFiveYearsAgo() {
    const currentDate = new Date(); // Current date
    const twentyFiveYearsAgo = new Date(currentDate);
    twentyFiveYearsAgo.setFullYear(currentDate.getFullYear() - 25);
  
    return Math.floor(twentyFiveYearsAgo.getTime() / 1000); // Timestamp for 25 years ago in seconds
  }

  function getTimestampFourDaysAgo() {
    const currentDate = new Date(); // Current date
    const fourDaysAgo = new Date(currentDate);
    fourDaysAgo.setDate(currentDate.getDate() - 4);
  
    return Math.floor(fourDaysAgo.getTime() / 1000); // Timestamp for 4 days ago in seconds
  }
  
  

const getData = async (ticker, type) =>{
    try{
        const currentTime = getCurrentTimestamp();
        const date2 = type === 'full' ? getTimestampTwentyFiveYearsAgo() : getTimestampFourDaysAgo()
        const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?symbol=${ticker}&period1=${date2}&period2=${currentTime}&useYfid=true&interval=1d&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&region=US&crumb=v8qZcEmjwF7&corsDomain=finance.yahoo.com`)
        const data = await res.json();
        const timestamps = data.chart.result[0].timestamp;
        const closing = data.chart.result[0].indicators.quote[0].close
        const returnedData = []
        for (let i = 0; i <timestamps.length; i++){
            const timestamp = timestamps[i];
            returnedData.push([timestamp * 1000, parseFloat(closing[i].toFixed(2))])
          }

        return Promise.resolve(returnedData);
    } catch(e){
        console.log("Caught error", e)
    }

}

app.get('/getData/:ticker/:type', async (req ,res)=>{
    const {ticker, type} = req.params;
    const data = await getData(ticker, type)
    res.send(data)
})



// app.use(sslRedirect())
app.use(express.static(__dirname + '/dist'));


app.get('/*', function(req,res) {
    console.log("sending file: ", __dirname+
    '/dist/index.html')
res.sendFile(path.join(__dirname+
'/dist/index.html'));});
const port = process.env.PORT || 8080
app.listen(port, ()=>{
  console.log(`Listening on port ${port}`)
});