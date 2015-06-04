require('should');
var buffer = require('buffer');

var bufferpack = require('..');


describe('Boolean', function() {
    var values = [true, false, 42];
    var format = '<?(first)?(second)b(third)';

    var packed = bufferpack.pack(format, values);

    describe('#pack()', function() {
        it('should have packed size of 3', function() {
            packed.length.should.equal(3);
        });

        it('should pack fine', function() {
            (!!packed[0]).should.equal(values[0]);
            (!!packed[1]).should.equal(values[1]);
            packed[2].should.equal(values[2]);
        });
    });

    describe('#unpack()', function() {
        var unpacked = bufferpack.unpack(format, packed);

        it('should return an object with correct values', function() {
            unpacked.should.be.an.instanceOf(Object);
            unpacked.first.should.equal(values[0]);
            unpacked.second.should.equal(values[1]);
            unpacked.third.should.equal(values[2]);
        });
    });
});
