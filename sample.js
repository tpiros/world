var marklogic  = require('marklogic');
var connection = require('./connection').connection;
var db         = marklogic.createDatabaseClient(connection);
var qb         = marklogic.queryBuilder;

db.documents.query(
  qb.where().orderBy(qb.sort(qb.pathIndex('/name/common')))
)
.result()
.then(function(documents) {
  console.log(documents);
})
.catch(function(error) {
  console.log(error);
});

//retrieves the first 20 documents - makes use of the Range Index 'id'
// db.documents.query(
//   qb.where().orderBy(qb.sort('id')).slice(1, 20)
// )
// .result()
// .then(function(documents) {
//   documents.forEach(function(document) {
//     console.log(document.content.name.common);
//   });
//   console.log('Total documents: ' + documents.length);
// })
// .catch(function(error) {
//   console.log(error);
// });

/*
// returns calculated information such as total, start and page-length properties
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
*/
