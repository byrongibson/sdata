var restify = require('restify');
var crypto = require('sdata-crypto');

var server = restify.createServer({
  name: 'sData Restful Service',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable))
  .use(restify.queryParser())
  .use(restify.bodyParser())
  .use(restify.fullResponse());

server.post('/login/:userId', function(req, res, next) {
  if (req.params.userId === undefined) {
    return next(new restify.InvalidArgumentError('UserId must be supplied'));
  }
  //get stored keys from postgres user_keys table
  pg.query(sql.getKey, [req.params.userId], function(err, resp) {
    if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err)));
    else if (!resp || !resp.rows || resp.rows.length < 1) return next(new restify.InvalidArgumentError('No response for userId: ' + userId));

    crypto.decryptPrivateKey(resp.rows[0].private_key, req.body.password, function(err, privateKey) {
      if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err)));
      res.send(201, privateKey);
    });
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