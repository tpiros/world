var marklogic  = require('marklogic');
var connection = require('./connection').connection;
var db         = marklogic.createDatabaseClient(connection);
var qb         = marklogic.queryBuilder;

db.documents.query(
  qb.where().orderBy(qb.sort('id')).slice(0)
)
.result()
.then(function(documents) {
  console.log(documents);
})
.catch(function(error) {
  console.log(error);
});
