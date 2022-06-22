---
layout: page
title: Operating Systems
permalink: /operating-systems
---

## Processes & Threads<a name="processes-threads"></a>

A process is a program in execution. A single program can create many processes when run multiple times.
<br/><br/>
States of a process: 

- **New:** created (or) being-created process
- **Ready:** ready for execution
- **Run:** running process in CPU (only one process at a time can be under execution in a single processor)
- **Wait (or Block):** a process requesting I/O access
- **Complete (or Terminated):** completed execution
- **Suspended Ready:** if queue becomes full, some processes are moved to suspended ready state
- **Suspended Block:** if waiting queue becomes full

A thread is a segment of execution within a process. A process can contain multiple threads.

### Multithreading<a name="processes-threads-multithreading"></a>

Multithreading aims to parallelise work by dividing a process into multiple threads. While threads run within the same process in a shared memory space, processes run in separate memory spaces.
Threads are not independent of one another like processes are, and as a result threads share with other threads their code section, data section, and OS resources (like open files and signals). But, like process, a thread has its own program counter (PC), register set, and stack space.
<br/><br/>
Pros of threads:

- **Responsiveness:** when one thread completes its execution, then its output can be immediately returned
- **Faster context switch:** process context switching requires more overhead from the CPU
- **Effective utilization of multiprocessor system:** possibility to schedule multiple threads on multiple processor which makes process execution faster
- **Resource sharing:** Resources like code, data, and files can be shared among all threads within a process. However stack and registers can’t be shared among the threads - each thread has its own
- **Communication:** Communication between threads is easier, because they share common address space. In process we have to follow some specific communication technique for communication between two process.
- **Enhanced throughput of the system:** If a process is divided into multiple threads, and each thread function is considered as one job, then the number of jobs completed per unit of time is increased, thus increasing the throughput of the system.
   
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
1 << 2 = 4  = 2^2
1 << 3 = 8  = 2^3
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
