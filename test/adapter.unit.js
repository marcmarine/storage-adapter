'use strict';

const os = require('os');
const fs = require('fs');
const sinon = require('sinon');
const storj = require('storj-lib')
const expect = require('chai').expect;
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const path = require('path');
const FileStorageAdapter = require('..');
const TMP_DIR = path.join(os.tmpdir(), 'FILE_ADAPTER_TEST');
const { Writable } = require('stream');

function tmpdir() {
  return path.join(TMP_DIR, 'test-' + Date.now());
}

let store = null;
const hash = storj.utils.ripemd160('test');
const audit = new storj.AuditStream(12);
const item = new storj.StorageItem({
  hash: hash,
  shard: Buffer.from('test')
});

describe('FileStorageAdapter', function() {

  before(function() {
    if (storj.utils.existsSync(TMP_DIR)) {
      rimraf.sync(TMP_DIR);
    }
    mkdirp.sync(TMP_DIR);
    audit.end(Buffer.from('test'));
    store = new FileStorageAdapter(tmpdir());
  });

   describe('@constructor', function() {

    it('should create instance without the new keyword', function() {
      expect(
        FileStorageAdapter(tmpdir())
      ).to.be.instanceOf(FileStorageAdapter);
    });

  });


  describe('#_validatePath', function() {

    it('should not make a directory that already exists', function() {
      expect(function() {
        const tmp = tmpdir();
        mkdirp.sync(tmp);
        FileStorageAdapter.prototype._validatePath(tmp);
      }).to.not.throw(Error);
    });

  });

  describe('#_put🔥', function() {

    it('should store the item', function(done) {
      store._put(hash, item, function(err) {
        expect(err).equal(null);
        done();
      });
    });

    it('should throw if the write fails', function(done) {
      const stub = sinon.stub(fs, 'writeFile').callsArgWith(2, new Error('Failed'));
      
      store._put(hash, item, function(err) {
        expect(err).to.exist;
        expect(err.message).to.equal('Failed');
        stub.restore();
        done();
      });
    });


  });


  describe('#_get', function() {

    it('should return the stored item', function(done) {
      store._get(hash, function(err, item) {
        expect(err).to.equal(null);
        expect(item).to.be.instanceOf(Object);
        done();
      });
    });

    it('should callback error if write stream fails', function(done) {
      store._get('wrong key', function(err) {
        expect(err.message).to.equal('Not found');
        done();
      });
    });

  });

   describe('#_peek', function() {

    it('should return the stored item', function(done) {
      store._peek(hash, function(err, item) {
        expect(err).to.equal(null);
        expect(item).to.be.instanceOf(Object);
        done();
      });
    });

   });

   describe('#_del', function() {

    it('should delete the shard if it exists', function(done) {
      store._del(hash, function(err) {
        expect(err).to.equal(null);
        done();
      });
    });
  
    it('should callback error if unlink fails', function(done) {
      var stub = sinon.stub(fs, 'unlink').callsArgWith(
        1,
        new Error('Failed to delete')
      );
      
      store._del(hash, function(err) {
        expect(err.message).to.equal('Failed to delete');
        stub.restore();
        done();
      });
    });

  });
})