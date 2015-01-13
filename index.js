var restify = require('restify');
var crypto = require('sdata-crypto');

var server = restify.createServer({
  name: 'sData Restful Service',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.post('/login/:userId', function(req, res, next) {
  //get stored keys from postgres user_keys table
  pg.query(sql.getKey, [req.params.userId], function(err, resp) {
    if (err) {
      res.send(400, err);
      return next();
    }
  });
});

server.post('/logout/:userId', function(req, res, next) {

});

server.post('/data/:userId/:objectType', function(req, res, next) {

});


server.get('/data/:userId/:objectType/:uuid', function(req, res, next) {

});

server.get('/data/:userId/bankaccounts', function(req, res, next) {

});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});