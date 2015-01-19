module.exports = {
  getKey: 'SELECT * FROM sdata.user_keys WHERE active = TRUE AND user_id = $1',
  insertData: 'INSERT INTO sdata.user_data (data_type, key_id, active, data_encrypted, data_unsecure) VALUES (_data_type, _key_id, true, _data_secure, _data_unsecure)',
  getDataById: 'SELECT * FROM sdata.user_data WHERE key_id = $1 and data_id = $2',
  getDataByType: 'SELECT * FROM sdata.user_data WHERE key_id = $1 and data_type = $2',
}