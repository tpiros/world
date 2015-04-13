var marklogic  = require('marklogic');
var connection = require('./connection').connection;
var db         = marklogic.createDatabaseClient(connection);
var qb         = marklogic.queryBuilder;

var getPaginationData = function() {
  return db.documents.query(
    qb.where().orderBy(qb.sort('id')).slice(0)
  ).result();
}
var getDocuments = function(from) {
  return db.documents.query(
    qb.where().orderBy(qb.sort('id')).slice(from)
  ).result();
}

var getCountryInfo = function(uri) {
  return db.documents.read(uri).result();
}

var index = function(req, res) {
  console.log('calling index');
  var counter      = 0;
  var countryNames = [];
  var pageData     = {};
  var page = 1;
  if (req.params.page) {
    page = parseInt(req.params.page);
  } else {
    getPaginationData().then(function(data) {
      var totalDocuments  = parseInt(data.total);
      var perPage         = parseInt(data['page-length']);
      var totalPages      = parseInt(totalDocuments / perPage);
      pageData.totalPages = totalPages;
      var calculated = parseInt((perPage * page) - 9);

      getDocuments(calculated).then(function(documents) {
        documents.forEach(function(document) {
          counter++;
          countryNames.push(document.content.id);
          if (counter === documents.length) {
            pageData.result = countryNames;
            res.render('index', {data: pageData});
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
  var uri     = '/country/' + country.toLowerCase().replace(/\s/g, '') + '.json';
  getCountryInfo(uri).then(function(countryInfo) {
    countryInfo[0].content.referer = referer;
    res.render('country', {data: countryInfo[0].content});
  });
};

module.exports = {
  index: index,
  country: country
};
