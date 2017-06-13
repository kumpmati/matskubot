//require twit library
var Twit = require('twit');

//auth keys
var config = require('./config');

//declare twit object
var T = new Twit(config);
//commands
var cmd = require('./cmd');

var statusfilter = "#bored";

//declare stream of matskubot mention
var mentionStream = T.stream('statuses/filter', {track: '@matskubot'});
//every tweet with #moi in it
var publicStream = T.stream('statuses/filter', {track: statusfilter});

//current date and time
var currentdate = new Date();
var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//clear console screen
process.stdout.write('\033c');

//starting messages
console.log("starting twitter bot @matskubot");
console.log("starting time: " + datetime);

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//get commands from command line
rl.question('', (answer) => {
    //do something when input is given
    
    rl.close();
});

//when a tweet with the parameters of publicStream is posted
publicStream.on('tweet', function (tweet) {
    //send all sockets the text, profile picture url and profile link
    console.log(datetime + ": " + tweet.text);
    io.sockets.emit('new tweet',
    { msg: tweet.text, img: tweet.user.profile_image_url, profile: tweet.user.screen_name, type: "normal" });
});

//on @matskubot mention
mentionStream.on('tweet', function (tweet) {
    io.sockets.emit('new tweet',
        { msg: tweet.text, img: tweet.user.profile_image_url, profile: tweet.user.screen_name, type: "special" });
    //if tweet text includes text '/weather', check weather at location of sent tweet and tweet back weather
    if (tweet.text.includes("/weather")) {
        console.log("tweet from " + tweet.user.screen_name + " requested weather, send it now >:[");
        cmd.getWeather(tweet, tweet.user.screen_name);
        
    } else {
        //if tweet does not include '/weather', don't do anything
        console.log("tweet did not request weather, don't do anything");
    }
});

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io').listen(3001);

io.sockets.on('connection', function(socket) {
});

app.use(require('express').static('html'));
server.listen(process.env.PORT || 5000);
