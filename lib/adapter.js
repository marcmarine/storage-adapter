'use strict';

const assert = require('assert');
const fs = require('fs');
const inherits = require('util').inherits;
const mkdirp = require('mkdirp');
const path = require('path');
const storj = require('storj-lib');

/**
 * Implements a file-based storage adapter
 * @extends {StorageAdapter}
 * @param {String} storageDirPath
 */
function FileStorageAdapter(storageDirPath) {
  if (!(this instanceof FileStorageAdapter)) {
    return new FileStorageAdapter(storageDirPath);
  }

  this._validatePath(storageDirPath);

  this._path = storageDirPath;
}

inherits(FileStorageAdapter, storj.StorageAdapter);

/**
 * Validates the storage path
 * @private
 */
FileStorageAdapter.prototype._validatePath = function(storageDirPath) {
  if (!storj.utils.existsSync(storageDirPath)) {
    mkdirp.sync(storageDirPath);
  }

  assert(storj.utils.isDirectory(storageDirPath), 'Invalid directory path supplied');
};

/**
 * Implements the abstract {@link StorageAdapter#_get}
 * @private
 * @param {String} key
 * @param {Function} callback
 */
FileStorageAdapter.prototype._get = function(key, callback) {
  const filePath = path.join(this._path, key);
  
  fs.open(filePath, 'r', (err, shard) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return callback(new Error('Not found'));
      }

      return callback(err);
    }
  
    const result = {
      hash: key,
      shard
    };
    
    return callback(null, result);
  });
};

/**
 * Implements the abstract {@link StorageAdapter#_peek}
 * @private
 * @param {String} key
 * @param {Function} callback
 */
FileStorageAdapter.prototype._peek = FileStorageAdapter.prototype._get

/**
 * Implements the abstract {@link StorageAdapter#_put}
 * @private
 * @param {String} key
 * @param {StorageItem} item
 * @param {Function} callback
 */
FileStorageAdapter.prototype._put = function(key, item, callback) {
  const filePath = path.join(this._path, key);
  fs.writeFile(filePath, item.shard, callback);
};

/**
 * Implements the abstract {@link StorageAdapter#_del}
 * @private
 * @param {String} key
 * @param {Function} callback
 */
FileStorageAdapter.prototype._del = function(key, callback) {
  const filePath = path.join(this._path, key);

  fs.unlink(filePath, function(err) {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
};

/**
 * Implements the abstract {@link StorageAdapter#_flush}
 * @private
 * @param {Function} callback
 */
FileStorageAdapter.prototype._flush = function(callback) {

  callback(null);
};

/**
 * Implements the abstract {@link StorageAdapter#_size}
 * @private
 * @param {String} [key]
 * @param {Function} callback
 */
FileStorageAdapter.prototype._size = function(key, callback) {

  callback(null);
};

/**
 * Implements the abstract {@link StorageAdapter#_keys}
 * @private
 * @returns {ReadableStream}
 */
FileStorageAdapter.prototype._keys = function() {

  callback(null);
};

module.exports = FileStorageAdapter;