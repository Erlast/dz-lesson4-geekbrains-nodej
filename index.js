/**
 * Created by Женя on 05.03.2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var template = require('consolidate').handlebars;
var request = require('request');
var cheerio = require('cheerio');

var app = express();

app.engine('hbs', template);
app.set('view engine', 'hbs');
app.set('views', __dirname + "/views");

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());
app.get('/', function (req, res) {
    res.render('index');
});

app.post("/", function (req, res) {
    var arr = req.body;
    var result = "";
    switch (arr.resurs) {
        case 'mail':
            result = getNewsMail(arr.razdel);
            break;
        case 'yandex':
            result = getNewsYandex(arr.razdel);
            break;
        case 'ria':
            result = getNewsRia(arr.razdel);
            break;
    }
    res.render('index', {result: result})
})

var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server was running on: ", host, port);

});
var newsArr = {
    'mail': {
        'politics': 'https://news.mail.ru/politics/',
        'economy': 'https://news.mail.ru/economics/',
        'sport': 'https://sport.mail.ru/'
    },
    'yandex': {
        'politics': 'https://news.yandex.ru/politics.html',
        'economy': 'https://news.yandex.ru/business.html',
        'sport': 'https://news.yandex.ru/sport.html'
    },
    ria: {
        'politics': 'http://ria.ru/politics/',
        'economy': 'http://ria.ru/economy/',
        'sport': 'http://ria.ru/sport/'
    }
}
function getNewsMail(razdel) {
    var result = ""
    request(newsArr.mail[razdel], function (error, response, html) {
        result = error;
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var news={}
            $('.cell').each(function () {
                console.log("here3");
                if(!$(this).hasClass('cell_photo')) {
                    var oneNew={};
                    oneNew['title'] = $(this).find('.newsitem__title-inner').text();
                    oneNew['text']=$(this).find('.newsitem__text').text()
                }
                news[news.length]=oneNew;
            });
            result=news;
        }
    });
    return result;
}

function getNewsYandex(razdel) {
    return "Вы выбрали " + razdel;
}

function getNewsRia(razdel) {
    return "Вы выбрали " + razdel;
}