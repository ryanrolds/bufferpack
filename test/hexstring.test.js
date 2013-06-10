
require('should');
require('buffer');

var bufferpack = require('..');

describe('Hex String', function() {
  var values = '01eb6d8eafc3';
  var format = '6x';

  describe('#pack()', function() {
    var packed = bufferpack.pack(format, values);

    it('should have packed size of 6', function() {
      packed.length.should.equal(6);
    });

    it('should back fine', function() {
      packed[0].should.equal(parseInt(values[0*2], 16) * 16 + parseInt(values[0*2+1], 16));
      packed[1].should.equal(parseInt(values[1*2], 16) * 16 + parseInt(values[1*2+1], 16));
      packed[2].should.equal(parseInt(values[2*2], 16) * 16 + parseInt(values[2*2+1], 16));
      packed[3].should.equal(parseInt(values[3*2], 16) * 16 + parseInt(values[3*2+1], 16));
      packed[4].should.equal(parseInt(values[4*2], 16) * 16 + parseInt(values[4*2+1], 16));
      packed[5].should.equal(parseInt(values[5*2], 16) * 16 + parseInt(values[5*2+1], 16));
    });
  });


  var buffSize = bufferpack.calcLength(format, values);

  it('buffer size should be 6', function() {
    buffSize.should.equal(6);
  });

  var buffer = new Buffer(buffSize);

  describe('#packTo()', function() {
    bufferpack.packTo(format, buffer, 0, values);

    it('should pack fine', function() {
      buffer[0].should.equal(parseInt(values[0*2], 16) * 16 + parseInt(values[0*2+1], 16));
      buffer[1].should.equal(parseInt(values[1*2], 16) * 16 + parseInt(values[1*2+1], 16));
      buffer[2].should.equal(parseInt(values[2*2], 16) * 16 + parseInt(values[2*2+1], 16));
      buffer[3].should.equal(parseInt(values[3*2], 16) * 16 + parseInt(values[3*2+1], 16));
      buffer[4].should.equal(parseInt(values[4*2], 16) * 16 + parseInt(values[4*2+1], 16));
      buffer[5].should.equal(parseInt(values[5*2], 16) * 16 + parseInt(values[5*2+1], 16));
    });
  });

  describe('#unpack()', function() {
    var unpacked = bufferpack.unpack(format, buffer, 0);

    it('should return an array', function() {
      unpacked.should.be.an.instanceof(Array);
    });

    it('should return same values as in values', function() {
      unpacked[0].should.equal(values);
    });

  describe('zero with null term string', function() {
    var packed = bufferpack.pack('6x', values);

    it('third should be ""', function() {
      var unpacked = bufferpack.unpack('6x(n)', packed);
      unpacked.n.should.equal(values);
    });
  });
  });
});
