//TODO:
// sql.getKey: get key for user with give id
// sql.insertData: insertion for "user_data", takes in data_type, key_id, data_secure, data_unsecure

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
    crypto.decryptPrivateKey(resp.rows[0].private_key_encrypted, req.body.password, function(err, privateKey) {
      if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err)));

      // store the private key in redis and return it (return is optional)
      redis.hmset(req.params.userId, {
        key_id: resp.rows[0].user_id,
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
  if (req.params.userId === undefined || req.params.dataType === undefined) return next(new restify.InvalidArgumentError('User Id and data type must be supplied.'));
  if (!req.body.secure || !req.body.unsecure) return next(new restify.InvalidArgumentError('Secure and unsecure data must be supplied.'));

  // assume the key is already decrypted and present in redis
  redis.hget(req.prams.userId, function(err, result) {
    if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err)));
    var data_secure = crypto.encrypt(req.body.secure, result.public_key);
    pg.query(sql.insertData, [result.key_id, req.params.dataType, data_secure, req.body.unsecure], function(err, result) {
      if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err)));
      else if (!result || result.rows[0].length < 1) return next(new restify.InvalidArgumentError('Insert data returned no result!'));
      res(200, result.rows[0]);
    });
  });
});

server.get('/data/:userId', function(req, res, next) {
  if (req.params.userId === undefined || req.params.dataType === undefined) return next(new restify.InvalidArgumentError('User id or data type must be supplied'));
  if (req.query.type === undefined && req.query.id === undefined) return next(new restify.InvalidArgumentError('Type or id query must be supplied'));
  var sqlToCall, params;
  if (req.query.type) {
    sqlToCall = sql.getDataByType;
    params = [req.params.userId, req.query.type];
  } else if (req.query.id) {
    sqlToCall = sql.getDataById;
    params = [req.params.userId, req.query.id];
  }
  redis.hget(req.params.userId, function(err, redisResult) {
    if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err)));
    if (!redisResult || !redisResult.private_key) return next(new restify.InvalidArgumentError('Cannot find private key for userId: ' + req.params.userId));

    pg.query(sql.getDataByType, params, function(err, pgResult) {
      if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err)));
      if (!pgResult || !pgResult.rows || !pgResult.rows.length < 1) return next(new restify.InvalidArgumentError('Cannot find data for userId: ' + req.params.userId + ', type: ' + req.params.dataType));
      var decrypted_data = crypto.decrypt(redisResult.private_key, pgResult.rows[0].encrypted_data);
      res.send(200, {
        id: pgResult.rows[0].id,
        user_id: pgResult.rows[0].user_id,
        data_type: pgResult.rows[0].data_type,
        secure: decrypted_data,
        unsecure: pgResult.rows[0].unsecure_data
      });
    })
  });
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});