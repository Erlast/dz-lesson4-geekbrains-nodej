/**
 * Created by Женя on 05.03.2016.
 */
var express = require('express');


var template = require('consolidate').handlebars;
var app = express();
//
app.engine('hbs', template);
app.set('engine view', 'hbs');
app.set('views', __dirname + "/views");

app.get('/', function (req, res) {
    res.render('index');
});

var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server was running on: ", host, port);

})