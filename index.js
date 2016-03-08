/**
 * Created by Женя on 05.03.2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var template = require('consolidate').handlebars;
var request = require('request');
var cheerio = require('cheerio');
var cookieParser = require('cookie-parser');


var app = express();

var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server was running on: ", host, port);
});

var newsArr = {
    'politika': 'http://www.livekuban.ru/news/politika/',
    'ekonomika': 'http://www.livekuban.ru/news/ekonomika/',
    'kultura': 'http://www.livekuban.ru/news/kultura/',
    'proisshestviya': 'http://www.livekuban.ru/news/proisshestviya/',
    'sport': 'http://www.livekuban.ru/news/sport/'

};

app.engine('hbs', template);
app.set('view engine', 'hbs');
app.set('views', __dirname + "/views");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser())


app.get('/', function (req, res) {
    res.render('index');
});

app.post("/", function (req, res) {
    var arr = req.body;
    var body = {};
    if (req.cookies.razdel)
        for (var key in newsArr) {
            if (key == req.cookies.razdel) {
                body = {key: true};
            }
        }
    if (req.cookie) {
        count = "c" + req.cookie.count;
        body = {count: true};
    }
    //console.log(req.cookies);
    res.cookie('razdel', arr.razdel);
    res.cookie('count', arr.count);
    getNews(arr.razdel, arr.count, function (result) {
        res.render('index', {result: result,body:body})
    });


});


function getNews(razdel, count, callback) {
    var news = {};
    request(newsArr[razdel], function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            news = {};
            $('.node-type-interview').each(function () {
                var oneNew = {};
                oneNew['title'] = $(this).find(".field-title div a").text();
                oneNew['date'] = $(this).find('.date').text();
                oneNew['description'] = $(this).find(".field-teaser div").text();
                var object_length = Object.keys(news).length;
                if (object_length < count)
                    news['new' + object_length] = oneNew;

            });
            callback(news);
        }
    });
}


