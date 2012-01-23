bufferpack - Module to pack primitives and C strings to buffers
====================================================
## Disclaimer

The jspack module and documentation are essentially ports of the
Python struct module and documentation, with such changes as were necessary. The port
was originaly made by Fair Oaks Labs, Inc. and published at http://code.google.com/p/jspack/
If any Python people are miffed that their documentation got ripped off, let me know,
and I'll gladly revise them. The original port to Node.js was done by pgriess. This
is a fork of node-jspack (https://github.com/pgriess/node-jspack && https://github.com/birchroad/node-jspack).

This module performs conversions between JavaScript values and C structs
represented as octet arrays (i.e. JavaScript arrays of integral numbers
between 0 and 255, inclusive).  It uses format strings (explained below) as
compact descriptions of the layout of the C structs and the intended conversion
to/from JavaScript values.  This can be used to handle binary data stored in
files, or received from network connections or other sources.

## Install

    npm install bufferpack

## Reference

The module defines the following functions:

### unpack(format, buffer, position)

Return an array or object containing values unpacked from the octet array a,
beginning at position p, according to the supplied format string.  If there
are more octets in a than required by the format string, the excess is
ignored.  If there are fewer octets than required, unpack() will return
undefined.  If no value is supplied for the p argument, zero is assumed. By default
an array of values is returned. However, if all format characters are assigned
a name/key an object containing all key/value pairs will returned.

### packTo(format, buffer, position, values)

Pack and store the values array into the supplied octet array a, beginning
at position p.  If there are more values supplied than are specified in the
format string, the excess is ignored.  If there are fewer values supplied,
packTo() will return false.  If there is insufficient space in a to store
the packed values, packTo() will return false.  On success, packTo() returns
the a argument. If any value is of an inappropriate type, the results are
undefined.

### pack(format, values)

Return an octet array containing the packed values array.  If there are
more values supplied than are specified in the format string, the excess is
ignored.  If there are fewer values supplied, pack() will return false.  If
any value is of an inappropriate type, the results are undefined.

### calcLength(format, values)

Return the number of octets required to store the given format string.

## Formats

Format characters have the following meanings; the conversion between C and
JavaScript values should be obvious given their types:

    Format | C Type         | JavaScript Type   | Size (octets) | Notes
    -------------------------------------------------------------------
       A   | char[]         | Array             |     Length     |  (1)
       x   | pad byte       | N/A               |        1       |
       c   | char           | string (length 1) |        1       |  (2)
       b   | signed char    | number            |        1       |  (3)
       B   | unsigned char  | number            |        1       |  (3)
       h   | signed short   | number            |        2       |  (3)
       H   | unsigned short | number            |        2       |  (3)
       i   | signed long    | number            |        4       |  (3)
       I   | unsigned long  | number            |        4       |  (3)
       l   | signed long    | number            |        4       |  (3)
       L   | unsigned long  | number            |        4       |  (3)
       S   | C string       | string            |        *       |  (6)
       s   | char[]         | string            |     Length     |  (2)
       f   | float          | number            |        4       |  (4)
       d   | double         | number            |        8       |  (5)

Notes:

  (1) The "A" code simply returns a slice of the source octet array.  This is
  primarily useful when a data structure contains bytes which are subject to
  multiple intepretations (e.g. unions), and the data structure is being
  decoded in multiple passes.

  (2) The "c" and "s" codes handle strings with codepoints between 0 and 255,
  inclusive.  The data are not bounds-checked, so strings containing  characters
  with codepoints outside this range will encode to "octet" arrays that contain
  values outside the range of an octet.  Furthermore, since these codes decode
  octet arrays by assuming the octets represent UNICODE codepoints, they may
  not "correctly" decode bytes in the range 128-255, since that range is subject
  to multiple interpretations.  Caveat coder!

  (3) The 8 "integer" codes clip their encoded values to the minima and maxmima
  of their respective types:  If you invoke Struct.pack('b', [-129]), for
  instance, the result will be [128], which is the octet encoding of -128,
  which is the minima of a signed char.  Similarly, Struct.pack('h', [-32769])
  returns [128, 0].  Fractions are truncated.

  (4) Since JavaScript doesn't natively support 32-bit floats, whenever a float
  is stored, the source JavaScript number must be rounded.  This module applies
  correct rounding during this process.  Numbers with magnitude greater than or
  equal to 2^128-2^103 round to either positive or negative Infinity. The
  rounding algorithm assumes that JavsScript is using exactly 64 bits of
  floating point precision; 128-bit floating point will result in subtle errors.

  (5) This module assumes that JavaScript is using 64 bits of floating point
  precision, so the "d" code performs no rounding.  128-bit floating point will
  cause the "d" code to simply truncate significands to 52 bits.

  (6) Same handling as (2), but with varible length. Length of c strings is
  variable, C strings are length + 1 (null byte).
  

A format character may be preceded by an integral repeat count.  For example,
the format string "4h" means exactly the same thing as "hhhh".

Whitespace characters between formats are ignored; a count and its format must
not be separated by whitespace, however.

For the "A" format character, the count is interpreted as the size of the
array, not a repeat count as for the other format characters; for example, "10A"
means a single 10-octet array.  When packing, the Array is truncated or padded
with 0 bytes as appropriate to make it conform to the specified length.  When
unpacking, the resulting Array always has exactly the specified number of bytes.
As a special case, "0A" means a single, empty Array.

For the "s" format character, the count is interpreted as the size of the
string, not a repeat count as for the other format characters; for example,
"10s" means a single 10-byte string, while "10c" means 10 characters.  When
packing, the string is truncated or padded with 0 bytes as appropriate to make
it conform to the specified length.  When unpacking, the resulting string always
has exactly the specified number of bytes.  As a special case, "0s" means a
single, empty string (while "0c" means 0 characters). If variable length strings
required use the "S" format character, values decoded/encoded this way must be null
terminated.

A name/key can be assigned to each format character using "(name)". For unpack to 
use names each format character in the format string must be assigned a name.
Example: "S(firstName)S(lastName)B(age)". This would result in unpack returning 
{"firstName": "Ryan", "lastName": "Olds", "age": 28}

By default, C numbers are represented in network (or big-endian) byte order.
Alternatively, the first character of the format string can be used to indicate
byte order of the packed data, according to the following table:

    Character | Byte Order
    ----------------------------------
        <     | little-endian
        >     | big-endian
        !     | network (= big-endian)

If the first character is not one of these, "!" is assumed.

## Running Tests

To run the test suite first invoke the following command within the repo, installing the development dependencies:

    $ npm install

then run the tests:

    $ npm test