---
layout: page
title: Algorithms
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
