---
layout: page
title: Algorithms
description: Notes on Big O notation, graphs, sorting, binary search, trees, hash tables, stacks, and queues.
permalink: /algorithms
---

## Big O Notation<a name="big-o"></a>

An algorithm’s efficiency depends on the number of steps it takes, known as ‘Big-O Notation’. The notation is determined by how it responds to different sizes of a given dataset.
<br/><br/>
O stands for Order Of, so O(N) is read “Order of N” — O(N) describes how many steps an algorithm takes based on the number of elements that it is acted upon.

### Time Complexity and Space Complexity

The **time complexity** of an algorithm quantifies the amount of time taken by an algorithm to run as a function of the length of the input. Similarly, the **space complexity** of an algorithm quantifies the amount of space or memory taken by an algorithm to run as a function of the length of the input.

### Common Complexities

#### O(1) — Constant

O(1) means that the algorithm takes the same number of steps to execute regardless of how much data is passed in.

#### O(log N) — Logarithmic

Simply put, O(logN) describes an algorithm that its number of operations increases by one each time the data is doubled.

#### O(N) — Linear

An algorithm that is O(N) will take as many steps as there are elements of data. So when an array increases in size by one element, an O(N) algorithm will increase by one step.

#### O(N log N) — Log-linear

An algorithm of this complexity class is doing log(N) work N times and therefore its performance is slightly worse than O(N). Many practical algorithms belong in this category (from sorting, to pathfinding, to compression), so we are mentioning it for completeness.

#### O(N²) — Quadratic

O(N²) represents the complexity of an algorithm, whose performance is proportional to the square of the size of the input elements. It is generally quite slow: If the input array has 1 element it will do 1 operation, if it has 10 elements it will do 100 operations, and so on.

#### O(2ᴺ) — Exponential

Exponential growth means that the algorithm takes twice as long for every new element added.

#### O(N!) — Factorial

This class of algorithms has a run time proportional to the factorial of the input size: n! = n _ (n-1) _ (n-2) _ (n-3) _ . . . \* 1.

<div class="separator"></div>

## Data Structure & Algorithms<a name="data-algo"></a>

### Graph<a name="data-algo-graph"></a>

<img style="float: left; margin-right: 20px;" src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Small_Network.png">

A Graph is a non-linear data structure consisting of nodes and edges. The nodes are sometimes also referred to as vertices and the edges are lines or arcs that connect any two nodes in the graph. More formally a Graph can be defined as: _a graph consists of a finite set of vertices (or nodes) and set of Edges which connect a pair of nodes._
<br/><br/>
A graph can be **directed** or **undirected**. In a directed graph an edge runs one way. In an undirected graph the connection goes both ways. An edge can also carry a **weight**, a cost or a distance. A path is a sequence of edges from one node to another, and a cycle is a path that returns to where it started.

<div style="clear: both;"></div>

Two common ways to store a graph:

- **Adjacency list:** each node keeps a list of the nodes it connects to. A sparse graph, where most pairs are not connected, stays small. Finding a node's neighbours is quick.
- **Adjacency matrix:** a grid with one row and one column per node, and a mark where an edge exists. Checking whether two particular nodes are connected is O(1). The grid costs O(N²) space, so it suits a dense graph.

#### Traversal<a name="data-algo-graph-traversal"></a>

Walking a graph means visiting each reachable node once.
<br/><br/>
**Breadth-first search**<br/><br/>
Breadth-first search visits nodes in layers, using a queue. Start at a node, then its neighbours, then their neighbours. On an unweighted graph, the first time a node is reached is by the fewest edges. It runs in O(N + E), where E is the number of edges.
<br/><br/>
**Depth-first search**<br/><br/>
Depth-first search follows one branch as far as it will go, using a stack, or the call stack when it is written with recursion. It then steps back and tries the next branch. It also runs in O(N + E). It is a natural way to detect a cycle, to order a directed graph topologically, or to explore a maze.

### Sorting<a name="data-algo-sorting"></a>

Sorting puts a collection into order. A comparison sort decides that order by comparing pairs of items, and in the general case it cannot do better than O(N log N). Merge sort, heapsort, and the average case of quicksort all land there.
<br/><br/>

- **Merge sort:** splits the collection in half, sorts each half, then merges the two sorted halves. It is always O(N log N), and it needs O(N) extra space for the merge.
- **Quicksort:** picks a pivot and partitions the rest into smaller items and larger items. The average time is O(N log N). A consistently bad pivot, such as always choosing the smallest item, degrades it to O(N²).
- **Heapsort:** builds a heap, then repeatedly removes the root. It is O(N log N) and needs no second array, though the constant work is usually higher than quicksort.

A sort that does not compare items can beat that bound when the values have a limited shape. Counting sort and radix sort run in linear time relative to the number of items plus the range of the values, or the number of digits.

### Binary search<a name="data-algo-search"></a>

Binary search finds a value in a **sorted** collection. Look at the middle item. If it is too small, the value can only sit in the right half. If it is too large, only the left half remains. Each step throws away half of what is left, so the search is O(log N): one more step each time the data doubles.
<br/><br/>
The collection has to be sorted first, and that sorting is the O(N log N) part. Searching an unsorted collection is a linear scan, O(N). Binary search also needs random access, so it fits an array and not a linked list.

### Tree<a name="data-algo-tree"></a>

A Tree is a hierarchical data structure made of nodes connected by edges, with one node treated as the root. Unlike a graph, a tree has no cycles: there is exactly one path between any two nodes.
<br/><br/>
A node can have child nodes, and the node directly above it is its parent. A node with no children is a leaf. The depth of a node is the number of edges between it and the root.
<br/><br/>
Common kinds:

- **Binary tree:** each node has at most two children, usually called left and right
- **Binary search tree:** a binary tree kept in order. Every value in the left subtree is smaller than the node, and every value in the right subtree is larger. Lookup, insert, and delete are O(log N) when the tree stays balanced, and fall back to O(N) when it leans to one side
- **Heap:** a tree ordered by a different rule. In a min-heap every parent is smaller than its children, so the smallest value sits at the root. Removing it and restoring the order takes O(log N), which makes a heap a natural priority queue

### Hash table<a name="data-algo-hash"></a>

A hash table stores a value under a key and finds it again without scanning the whole collection. A hash function turns the key into an index in an underlying array. When keys spread evenly across that array, lookup, insert, and delete are O(1) on average.
<br/><br/>
Two different keys can produce the same index. That is a collision. The usual ways to deal with it:

- **Chaining:** each index holds a short list of every key that landed there
- **Open addressing:** the table looks onward through other slots until it finds an empty one

If every key collides, those operations fall back to O(N). A hash function that spreads keys out, and a table that grows before it gets too full, keeps that case rare.

### Stack & Queue<a name="data-algo-stack-queue"></a>

A stack and a queue are both linear collections with a restricted way in and out. The restriction is the point of them.
<br/><br/>
**Stack**<br/><br/>
A stack is last-in, first-out. The item added most recently is the first one removed. Adding is called push and removing is called pop, and both are O(1). Function calls work this way: calling a function pushes a frame, and returning pops it. Depth-first search and undo do the same.
<br/><br/>
**Queue**<br/><br/>
A queue is first-in, first-out. Items leave in the order they arrived. Adding at the back is enqueue and removing from the front is dequeue. Both are O(1) when the queue is a linked list or a circular buffer. Breadth-first search uses a queue: visit a node, then line its neighbours up to be visited later.
