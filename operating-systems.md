---
layout: page
title: Operating Systems
permalink: /operating-systems
---

## Bit Manipulation<a name="bit-manipulation"></a>

Operations with bits are used in Data compression (data is compressed by converting it from one representation to another, to reduce the space), Exclusive-Or Encryption (an algorithm to encrypt the data for safety issues). In order to encode, decode or compress files we have to extract the data at bit level. Bitwise Operations are faster and closer to the system and sometimes optimize the program to a good level.
<br/><br/>
One byte comprises of 8 bits and any integer or character can be represented using bits in computers, which we call its binary form (contains only 1 or 0) or in its base 2 form. For characters, we use ASCII representation, which are in the form of integers which again can be represented using bits.
<br/><br/>

```
14  = {1110}2
    = 1 * 2^3 + 1 * 2^2 + 1 * 2^1 + 0 * 2^0
    = 14.

20  = {10100}2
    = 1 * 2^4 + 0 * 2^3 + 1 * 2^2 + 0 * 2^^1 + 0 * 2^0
    = 20.
```

### Bitwise Operators

|  X  |  Y  | X&Y | X&#124;Y | X^Y | ~(X) |
| :-: | :-: | :-: | :------: | :-: | ---- |
|  0  |  0  |  0  |    0     |  0  | 1    |
|  0  |  1  |  0  |    1     |  1  | 1    |
|  1  |  0  |  0  |    1     |  1  | 0    |
|  1  |  1  |  1  |    1     |  0  | 0    |

<br/><br/>**NOT ( ~ )**<br/><br/>
Bitwise NOT is an unary operator that flips the bits of the number i.e., if the ith bit is 0, it will change it to 1 and vice versa.
<br/><br/>

```
 N  =  5    =  (101)2
~N  = ~5    = ~(101)2   = (010)2 = 2
```

**AND ( & )**<br/><br/>
Bitwise AND is a binary operator that operates on two equal-length bit patterns. If both bits in the compared position of the bit patterns are 1, the bit in the resulting bit pattern is 1, otherwise 0.
<br/><br/>

```
A = 5 = (101)2
B = 3 = (011)2
A & B = (101)2 & (011)2 = (001)2 = 1
```

**OR ( | )**<br/><br/>
Bitwise OR is also a binary operator that operates on two equal-length bit patterns, similar to bitwise AND. If both bits in the compared position of the bit patterns are 0, the bit in the resulting bit pattern is 0, otherwise 1.
<br/><br/>

```
A = 5 = (101)2
B = 3 = (011)2
A | B = (101)2 | (011)2 = (111)2 = 7
```

**XOR ( ^ )**<br/><br/>
Bitwise XOR also takes two equal-length bit patterns. If both bits in the compared position of the bit patterns are 0 or 1, the bit in the resulting bit pattern is 0, otherwise 1.
<br/><br/>

```
A = 5 = (101)2
B = 3 = (011)2
A ^ B = (101)2 ^ (011)2 = (110)2 = 6
```

**Left Shift ( << )**<br/><br/>
Left shift operator is a binary operator which shift the some number of bits, in the given bit pattern, to the left and append 0 at the end. Left shift is equivalent to multiplying the bit pattern with ( if we are shifting k bits ).
<br/><br/>

```
1 << 1 = 2  = 2^1
1 << 2 = 4  = 2^2 1 << 3 = 8 = 2^3
1 << 4 = 16 = 2^4
…
1 << n = 2n
```

**Right Shift ( >> )**<br/><br/>
Right shift operator is a binary operator which shift the some number of bits, in the given bit pattern, to the right and append 1 at the end. Right shift is equivalent to dividing the bit pattern with 2k ( if we are shifting k bits ).
<br/><br/>

```
4 >> 1  = 2
6 >> 1  = 3
5 >> 1  = 2
16 >> 4 = 1
```
