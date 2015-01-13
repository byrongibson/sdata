var redis = require('redis');
var config = require('../config');

var client;
exports.getClient = function() {
  if (!client) {
    client = redis.createClient(config.redis.port || 6379, config.redis.host || 'localhost', {
      auth_pass: config.redis.pass
    });
  }
  return client
}