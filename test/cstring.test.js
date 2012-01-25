
require('should');
var buffer = require('buffer');

var bufferpack = require('..');

describe('C String', function() {
  var values = [1, 2, 3, 'test', 5, 6, 7];
  var format = '<bbbSbbb';

  describe('#pack()', function() {
    var packed = bufferpack.pack(format, values);

    it('should have packed size of 11', function() {
      packed.length.should.equal(11);
    });

    it('should back fine', function() {
      packed[0].should.equal(values[0]);
      packed[1].should.equal(values[1]);
      packed[2].should.equal(values[2]);
      packed[3].should.equal(values[3].charCodeAt(0));
      packed[4].should.equal(values[3].charCodeAt(1));
      packed[5].should.equal(values[3].charCodeAt(2));
      packed[6].should.equal(values[3].charCodeAt(3));
      packed[7].should.equal(0);
      packed[8].should.equal(values[4]);
      packed[9].should.equal(values[5]);
      packed[10].should.equal(values[6]);
    });
  });


  var buffSize = bufferpack.calcLength(format, values);

  it('buffer size should be 11', function() {
    buffSize.should.equal(11);
  });

  var buffer = new Buffer(buffSize);

  describe('#packTo()', function() {
    bufferpack.packTo(format, buffer, 0, values);

    it('should pack fine', function() {
      buffer[0].should.equal(values[0]);
      buffer[1].should.equal(values[1]);
      buffer[2].should.equal(values[2]);
      buffer[3].should.equal(values[3].charCodeAt(0));
      buffer[4].should.equal(values[3].charCodeAt(1));
      buffer[5].should.equal(values[3].charCodeAt(2));
      buffer[6].should.equal(values[3].charCodeAt(3));
      buffer[7].should.equal(0);
      buffer[8].should.equal(values[4]);
      buffer[9].should.equal(values[5]);
      buffer[10].should.equal(values[6]);
    });
  });

  describe('#unpack()', function() {
    var unpacked = bufferpack.unpack(format, buffer, 0);

    it('should return an array', function() {
      unpacked.should.be.an.instanceof(Array);
    });

    it('should return same values as in values', function() {
      unpacked[0].should.equal(values[0]);
      unpacked[1].should.equal(values[1]);
      unpacked[2].should.equal(values[2]);
      unpacked[3].should.equal(values[3]);
      unpacked[4].should.equal(values[4]);
      unpacked[5].should.equal(values[5]);
      unpacked[6].should.equal(values[6]);
    });

  describe('zero with null term string', function() {
    var values = ['foo', 'bar', 0, 'asdf'];
    var packed = bufferpack.pack('<SSbS', values);

    it('third should be ""', function() {
      var unpacked = bufferpack.unpack('<S(first)S(second)S(third)S(forth)', packed);
      unpacked.first.should.equal('foo');
      unpacked.second.should.equal('bar');
      unpacked.third.should.equal('');
      unpacked.forth.should.equal('asdf');
    });
  });
  });
});
