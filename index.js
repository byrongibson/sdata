//TODO:
// sql.getKey: get key for user with give id
// 

var restify = require('restify');
var crypto = require('sdata-crypto');
//databases
var redis = require('./db/redis').getClient();
var pg = require('./db/pg').getClient();

var server = restify.createServer({
  name: 'sData Restful Service',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable))
  .use(restify.queryParser())
  .use(restify.bodyParser())
  .use(restify.fullResponse());

server.post('/login/:userId', function(req, res, next) {
  if (req.params.userId === undefined) return next(new restify.InvalidArgumentError('User Id must be supplied'));
  else if (req.body.password === undefined) return return next(new restify.InvalidArgumentError('Password must be supplied'));

  //get stored keys from postgres user_keys table
  pg.query(sql.getKey, [req.params.userId], function(err, resp) {
    if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err)));
    else if (!resp || !resp.rows || resp.rows.length < 1) return next(new restify.InvalidArgumentError('No response for userId: ' + userId));
    crypto.decryptPrivateKey(resp.rows[0].private_key, req.body.password, function(err, privateKey) {
      if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err)));
      // store the private key in redis and return it
      redis.hmset(req.params.userId, {
        public_key: resp.rows[0].public_key,
        private_key: privateKey
      }, function(err) {
        if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err)));
        res.send(201, privateKey);
      });
    });
  });
});

server.post('/logout/:userId', function(req, res, next) {
  if (req.params.userId === undefined) return next(new restify.InvalidArgumentError('User Id must be supplied'));

  //delete all entries in redis associated with userId 
  redis.del(req.params.userId, function(err) {
    if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err)));
    res.send(200);
  });
});

server.post('/data/:userId/:dataType', function(req, res, next) {
  if (req.params.dataType === undefined) return next(new restify.InvalidArgumentError('Data type must be supplied.'));

});

server.get('/data/:userId/bankaccounts/:uuid', function(req, res, next) {

});

server.get('/data/:userId/bankaccounts', function(req, res, next) {

});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});