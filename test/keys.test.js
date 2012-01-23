
require('should');
var buffer = require('buffer');

var bufferpack = require('..');

describe('Keying', function() {
  var values = [1, 2, 3];
  var format = '<b(first)b(second)b(third)';

  var packed = bufferpack.pack(format, values);

  describe('#unpack()', function() {
    var unpacked = bufferpack.unpack(format, packed, 0);

    it('should return an object', function() {
      unpacked.should.be.a('object');
      unpacked.should.have.property('first');
      unpacked.first.should.equal(1);
      unpacked.should.have.property('second');
      unpacked.second.should.equal(2);
      unpacked.should.have.property('third');
      unpacked.third.should.equal(3);
    });

    it('should returned object should have 3 properties', function() {
      Object.keys(unpacked).length.should.equal(3);
    });
  });  
});