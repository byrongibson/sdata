module.exports = {
  redis: {
    host: process.env.REDIS_1_PORT_6379_TCP_ADDR || 'localhost',
    pass: 'randompass',
    port: process.env.REDIS_1_PORT_6379_TCP_PORT || 6379
  },
  pg: {
    host: process.env.ELLIE_1_PORT_5432_TCP_ADDR || 'localhost',
    port: process.env.ELLIE_1_PORT_5432_TCP_PORT || 5432,
    database: 'bitme_dev',
    user: 'bitme',
    password: '1234567890'
  }
}