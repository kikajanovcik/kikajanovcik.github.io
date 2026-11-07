---
layout: page
title: Algorithms
description: Notes on Big O, arrays, recursion, graphs, sorting, binary search, trees, hash tables, stacks, queues, and bit manipulation.
permalink: /algorithms
---

## Big O<a name="big-o"></a>

Big O says how the work grows as the input grows. O(N) means the steps track the number of items.
<br/><br/>
**Time** is the number of steps. **Space** is the extra memory.

- **O(1) — constant:** the same work for any size. Reading one slot of an array by its index.
- **O(log N) — logarithmic:** one more step each time the data doubles. Binary search.
- **O(N) — linear:** one more step for each extra item. A scan.
- **O(N log N) — log-linear:** log(N) work, done N times. The good comparison sorts land here, and so do a lot of practical algorithms.
- **O(N²) — quadratic:** the square of the input. Ten items is about a hundred steps. A loop nested inside a loop over the same collection.
- **O(2ᴺ) — exponential:** the work doubles with every new item.
- **O(N!) — factorial:** every ordering of the input. N × (N − 1) × (N − 2), down to 1.

## Arrays and linked lists<a name="data-algo-lists"></a>

An array stores items in one contiguous block. The item at index i is a fixed offset from the start, so reading or writing it is O(1). Inserting in the middle shifts everything after it.
<br/><br/>
A linked list stores each item in a node that points at the next. Inserting or removing at a node you already hold is O(1), because only the pointers change. Reaching the nth item means walking there, so it is O(N). There is no jump to the middle.
<br/><br/>
Binary search needs that jump, so it belongs on an array. An adjacency list is a list of neighbours hanging off each node, and walking it is the point.

## Recursion<a name="data-algo-recursion"></a>

A recursive function calls itself. Each call pushes a frame on the call stack, and a return pops it. An explicit stack does the same job without using the call stack.
<br/><br/>
Depth-first search and walking a tree are both "handle this node, then each child." The cost to watch is the depth. A tree that leans to one side is N frames deep, and the call stack runs out before the work finishes. The same walk written with a stack you allocate does not have that limit.

## Graph<a name="data-algo-graph"></a>

<img style="float: left; margin-right: 20px;" src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Small_Network.png">

A graph is a set of nodes joined by edges. The nodes are also called vertices. An edge connects a pair of them.
<br/><br/>
A graph can be **directed** or **undirected**. In a directed graph an edge runs one way. In an undirected graph the connection goes both ways. An edge can also carry a **weight**, a cost or a distance. A path is a sequence of edges from one node to another, and a cycle is a path that returns to where it started.

<div style="clear: both;"></div>

Two common ways to store a graph:

- **Adjacency list:** each node keeps a list of the nodes it connects to. A sparse graph, where most pairs are not connected, stays small. Finding a node's neighbours is quick.
- **Adjacency matrix:** a grid with one row and one column per node, and a mark where an edge exists. Checking whether two particular nodes are connected is O(1). The grid costs O(N²) space, so it suits a dense graph.

### Traversal<a name="data-algo-graph-traversal"></a>

Walking a graph means visiting each reachable node once.
<br/><br/>
**Breadth-first search**<br/><br/>
Breadth-first search visits nodes in layers, using a queue. Start at a node, then its neighbours, then their neighbours. On an unweighted graph, the first time a node is reached is by the fewest edges. It runs in O(N + E), where E is the number of edges.
<br/><br/>
**Depth-first search**<br/><br/>
Depth-first search follows one branch as far as it will go, using a stack, or the call stack when it is written with recursion. It then steps back and tries the next branch. It also runs in O(N + E). It is a natural way to detect a cycle, to order a directed graph topologically, or to explore a maze.

## Sorting<a name="data-algo-sorting"></a>

Sorting puts a collection into order. A comparison sort decides that order by comparing pairs of items, and in the general case it cannot do better than O(N log N). Merge sort, heapsort, and the average case of quicksort all land there.
<br/><br/>

- **Merge sort:** splits the collection in half, sorts each half, then merges the two sorted halves. It is always O(N log N), and it needs O(N) extra space for the merge.
- **Quicksort:** picks a pivot and partitions the rest into smaller items and larger items. The average time is O(N log N). A consistently bad pivot, such as always choosing the smallest item, degrades it to O(N²).
- **Heapsort:** builds a heap, then repeatedly removes the root. It is O(N log N) and needs no second array, though the constant work is usually higher than quicksort.

A sort that does not compare items can beat that bound when the values have a limited shape. Counting sort and radix sort run in linear time relative to the number of items plus the range of the values, or the number of digits.

## Binary search<a name="data-algo-search"></a>

Binary search finds a value in a **sorted** collection. Look at the middle item. If it is too small, the value can only sit in the right half. If it is too large, only the left half remains. Each step throws away half of what is left, so the search is O(log N): one more step each time the data doubles.
<br/><br/>
The collection has to be sorted first, and that sorting is the O(N log N) part. Searching an unsorted collection is a linear scan, O(N). Binary search also needs random access, so it fits an array and not a linked list.

## Tree<a name="data-algo-tree"></a>

A tree is nodes connected by edges, with one node as the root. Unlike a graph, a tree has no cycles: there is exactly one path between any two nodes.
<br/><br/>
A node can have children, and the node directly above it is its parent. A node with no children is a leaf. The depth of a node is the number of edges between it and the root.
<br/><br/>

- **Binary tree:** each node has at most two children, left and right
- **Binary search tree:** kept in order. Every value in the left subtree is smaller than the node, and every value in the right subtree is larger. Lookup, insert, and delete are O(log N) when the tree stays balanced, and fall back to O(N) when it leans to one side
- **Heap:** ordered by a different rule. In a min-heap every parent is smaller than its children, so the smallest value sits at the root. Removing it and restoring the order takes O(log N), which makes a heap a natural priority queue

## Hash table<a name="data-algo-hash"></a>

A hash table stores a value under a key and finds it again without scanning the whole collection. A hash function turns the key into an index in an underlying array. When keys spread evenly across that array, lookup, insert, and delete are O(1) on average.
<br/><br/>
Two different keys can produce the same index. That is a collision. The usual ways to deal with it:

- **Chaining:** each index holds a short list of every key that landed there
- **Open addressing:** the table looks onward through other slots until it finds an empty one

If every key collides, those operations fall back to O(N). A hash function that spreads keys out, and a table that grows before it gets too full, keeps that case rare.

## Stack & Queue<a name="data-algo-stack-queue"></a>

A stack and a queue are both linear collections with a restricted way in and out. The restriction is the point of them.
<br/><br/>
**Stack**<br/><br/>
A stack is last-in, first-out. The item added most recently is the first one removed. Adding is called push and removing is called pop, and both are O(1). Function calls work this way: calling a function pushes a frame, and returning pops it. Depth-first search and undo do the same.
<br/><br/>
**Queue**<br/><br/>
A queue is first-in, first-out. Items leave in the order they arrived. Adding at the back is enqueue and removing from the front is dequeue. Both are O(1) when the queue is a linked list or a circular buffer. Breadth-first search uses a queue: visit a node, then line its neighbours up to be visited later.

## Bit manipulation<a name="bit-manipulation"></a>

A bit is 0 or 1. A byte is 8 of them. Integers are stored this way, and so are characters once they have an ASCII code. Working on the bits themselves is how compression and some encryption move data, and it is close to what the machine already does, so it is often cheaper than arithmetic on the whole number.
<br/><br/>
Fourteen is `1110` in binary: 1×2³ + 1×2² + 1×2¹ + 0×2⁰. Twenty is `10100`.

|  X  |  Y  | X&Y | X&#124;Y | X^Y | ~(X) |
| :-: | :-: | :-: | :------: | :-: | ---- |
|  0  |  0  |  0  |    0     |  0  | 1    |
|  0  |  1  |  0  |    1     |  1  | 1    |
|  1  |  0  |  0  |    1     |  1  | 0    |
|  1  |  1  |  1  |    1     |  0  | 0    |

### Operators<a name="bit-manipulation-operators"></a>

**NOT ( ~ )**<br/><br/>
Flips every bit. On a 3-bit pattern, 5 is `101` and ~5 is `010`, which is 2. In a real integer the flip covers every bit of the word, including the sign bit, so the result is not 2.

```
 N  =  5    =  (101)2
~N  = ~5    = ~(101)2   = (010)2 = 2
```

**AND ( & )**<br/><br/>
Keeps a bit only where both inputs have 1. Useful for testing or clearing a single bit.

```
A = 5 = (101)2
B = 3 = (011)2
A & B = (001)2 = 1
```

**OR ( | )**<br/><br/>
Sets a bit where either input has 1. Useful for turning a bit on.

```
A = 5 = (101)2
B = 3 = (011)2
A | B = (111)2 = 7
```

**XOR ( ^ )**<br/><br/>
Sets a bit where the inputs differ. XORing a value with itself gives 0, and XORing twice with the same mask gives the value back.

```
A = 5 = (101)2
B = 3 = (011)2
A ^ B = (110)2 = 6
```

**Left shift ( << )**<br/><br/>
Moves the bits left by k places and fills the low end with 0. For a number that does not overflow, that multiplies by 2ᵏ.

```
1 << 1 = 2
1 << 2 = 4
1 << 3 = 8
1 << n = 2ⁿ
```

**Right shift ( >> )**<br/><br/>
Moves the bits right by k places and drops what falls off the end. For a positive integer that divides by 2ᵏ, rounding down. The bits that appear at the high end are 0 for a positive number.

```
4 >> 1  = 2
6 >> 1  = 3
5 >> 1  = 2
16 >> 4 = 1
```
