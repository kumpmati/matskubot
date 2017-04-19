var exports = module.exports = {};

//weather
var Forecast = require('forecast');

//var fs = require('fs');

//require twit library
var Twit = require('twit');
//auth keys
var config = require('./config');

//declare twit object
var T = new Twit(config);

var weather_summary = "null";

var forecast = new Forecast({
  service: 'darksky',
  key: '621372b136df3cf529c705fbfc1522af',
  units: 'celcius',
  cache: true,      // Cache API requests 
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/ 
    minutes: 27,
    seconds: 45
  }
});

exports.getWeather = function(tweet, to) {
    if(tweet.place.bounding_box.coordinates !== null) {
        var lon = tweet.place.bounding_box.coordinates[0][0][0];
        var lat = tweet.place.bounding_box.coordinates[0][0][1];
    }
    
    /*
    forecast.get([lat, lon], function(err, weather) {
            if(err) return console.dir(err);
            var summary = "the weather at "+lat+","+lon+" is " + weather.currently.summary + " at a temperature of " + weather.currently.temperature;
            return summary;
    });
    */
    forecast.get([lat, lon], function(err, weather) {
        //if error during forecast.get, log to console the error    
        if(err) return console.dir(err);
        w_summ = weather.currently.summary;
        w_temp = weather.currently.temperature;
        
        //if weather fetching is successful, change weather_summary to this
        weather_summary = "It's currently " + w_summ.toString().toLowerCase() + " at " + w_temp.toString().toLowerCase() + "°C there";
        //tweet the weather summary back to the person that tweeted
            //tweetIt(weather_summary, to);
    });
    return weather_summary;
};
    
function tweetIt(msg, to) {
    var done = false;
    var tweet1 = {
      status:   "@" + to + " " + msg
    };
    
    if (done === false) {
        T.post('statuses/update', tweet1, function(err, data, response) {
          
          //notify of outcome
          if (err) {
              console.log("couldnt send tweet");
              console.log(err);
              done = true;
          } else if (!err) {
              console.log("----sent: '@" + to + " " + msg + "'");
              done = true;
          }
        });
    }
};
