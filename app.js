'use strict';
var express    = require('express');
var bodyParser = require('body-parser')
var app        = express();
var router     = express.Router();
var routes     = require('./routes');

app.set('port', 8080);
app.set('view engine', 'jade');

app.use('/views', express.static(__dirname + '/views'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
router.route('/:page?').get(routes.index);
router.route('/country/:country').get(routes.country);
router.route('/search').post(routes.search);
app.use('/', router);

app.listen(app.get('port'));
console.log('Magic happens on port ' + app.get('port'));
