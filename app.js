const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const dotenv = require("dotenv");

dotenv.config();

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running at port 3000.");
});

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req,res) => {
    var city = req.body.city;
    const apiKey = process.env.OPEN_WEATHER_API_KEY;
    const unit = "metric";
    var url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units="+unit;
    
    https.get(url, (response) => {      //makes an HTTPS GET request to url
        response.on("data", (data) => { //If the response recieved has data, call the callback function by passing the data.
            var weather = JSON.parse(data);  //data received in response is in hex format. So, converting to JS object
            res.write("<h1>The temperature in "+city+" is: " + weather.main.temp + " deg. C.</h1>");
            res.write("<h3>The weather is currently " + weather.weather[0].description + ".</h3>");
            var imgUrl = "http://openweathermap.org/img/wn/"+ weather.weather[0].icon +"@2x.png";
            res.write('<img src=' + imgUrl + ' alt="Weather Icon Image"></img>');
            res.send();
        });
    });
});