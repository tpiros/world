var marklogic  = require('marklogic');
var connection = require('./connection').connection;
var db         = marklogic.createDatabaseClient(connection);
var qb         = marklogic.queryBuilder;

var getPaginationData = function() {
  return db.documents.query(
    qb.where().orderBy(qb.sort('id')).withOptions({categories: 'none'})
  ).result();
};

var getDocuments = function(from) {
  return db.documents.query(
    qb.where().orderBy(qb.sort('id')).slice(from)
  ).result();
};

var getCountryInfo = function(uri) {
  return db.documents.read(uri).result();
};

var doSearch = function(term) {
  return db.documents.query(
    qb.where(
      qb.term(term)
    )
    .orderBy(
      //qb.score('logtf'),
      qb.sort('id')
    )
    .withOptions({ debug: true })
    .slice(0, 257)
  ).result();
}

var index = function(req, res) {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
  } else {
    var counter      = 0;
    var countryNames = [];
    var pageData     = {};
    var page = 1;
    if (req.params.page) {
      page = parseInt(req.params.page);
    }
    getPaginationData().then(function(data) {
      var totalDocuments  = parseInt(data[0].total);
      var perPage         = parseInt(data[0]['page-length']);
      var totalPages      = parseInt(totalDocuments / perPage);
      pageData.totalPages = totalPages;
      var calculated = parseInt((perPage * page) - 9);

      getDocuments(calculated).then(function(documents) {
        documents.forEach(function(document) {
          counter++;
          countryNames.push({country: document.content.id, uri: document.uri});
          if (counter === documents.length) {
            pageData.result = countryNames;
            var active = req.url.replace('/', '').length === 0 ? 1 : req.url.replace('/', '');
            res.render('index', {data: pageData, active: active});
          }
        });
      }).catch(function(error) {
        console.log('Error', error);
      });
    }).catch(function(error) {
      console.log('Error', error);
    });
  }
};

var country = function(req, res) {
  var country = req.params.country;
  var referer = req.headers.referer;
  var uri     = '/country/' + country;
  getCountryInfo(uri).then(function(countryInfo) {
    countryInfo[0].content.referer = referer;
    res.render('country', {data: countryInfo[0].content});
  }).catch(function(error) {
    console.log(error);
  })
};

var search = function(req, res) {
  var term = req.body.search;
  doSearch(term).then(function(searchResult) {
    // just don't think about this ... bit of black magic
    // console.log(searchResult[0].results[0].matches[0].path)
    // console.log(searchResult[0].results[0].matches)
    // var matches = searchResult[0].results[0].matches[0].path;
    // var m = matches.match(/(array-node)(.+)/)[2];
    // var b = m.match(/\(.+\)/)[0];
    // var x = b.replace('\/text()', '').replace('("', '').replace('")', '');
    // var matchedText = searchResult[0].results[0].matches[0]['match-text'][0].highlight;
    var x = null;
    var matchedText = null;
    res.render('results', {stats: searchResult[0], matchedElement: x, matchedText: matchedText});
  }).catch(function(error) {
    console.log(error);
  })
};

module.exports = {
  index: index,
  country: country,
  search: search
};
