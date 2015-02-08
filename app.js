'use strict';
var express    = require('express');
var app        = express();
var router     = express.Router();
var routes     = require('./routes');

app.set('port', 8080);
app.set('view engine', 'jade');

app.use('/views', express.static(__dirname + '/views'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

router.route('/:page?').get(routes.index);
router.route('/country/:country').get(routes.country);
app.use('/', router);

app.listen(app.get('port'));
console.log('Magic happens on port ' + app.get('port'));
