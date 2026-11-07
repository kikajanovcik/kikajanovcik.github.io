---
layout: page
title: Operating Systems
description: Notes on processes, threads, scheduling, synchronisation, and memory.
permalink: /operating-systems
---

## Processes & Threads<a name="processes-threads"></a>

A process is a program in execution. Starting the program again creates another process, with its own memory.
<br/><br/>
A process moves through these states:

- **New:** being created
- **Ready:** waiting for a turn on the CPU
- **Run:** on the CPU. One core runs one process at a time
- **Wait:** blocked on I/O
- **Terminated:** finished
- **Suspended ready:** the ready queue is full, so the process is set aside
- **Suspended wait:** the same, for a process that is still blocked

A thread is one line of execution inside a process. A process can hold many threads.

### Multithreading<a name="processes-threads-multithreading"></a>

Split the process into threads so more than one piece of it can run at once. Threads share the process's code, data, and open files. Each thread keeps its own stack, registers, and program counter.
<br/><br/>
Sharing is the point and the risk. A thread can read another thread's result without a special channel, and switching between threads is cheaper than switching processes, because the address space stays. The same sharing is a race when two threads write the same data. That is [synchronisation](#synchronisation).
<br/><br/>

- **Responsiveness:** a finished thread can return its result while the others keep going
- **Several cores:** the scheduler can put different threads on different cores
- **Throughput:** more of the process finishes per unit of time, as long as the threads are not all waiting on the same lock

## Scheduling<a name="scheduling"></a>

The scheduler decides which ready process gets the CPU next. A context switch saves the running process and loads the next one. Switching threads is cheaper than switching processes, because threads already share an address space.
<br/><br/>

- **First come, first served:** runs processes in the order they arrived. A long job at the front holds everyone else up. That wait is the convoy effect.
- **Shortest job first:** runs the process with the smallest CPU burst next. Average waiting time is low when the bursts are known. A long job can starve if short jobs keep arriving.
- **Round robin:** each process gets a fixed time slice, then goes to the back of the queue. A short slice feels responsive. A slice that is too short spends its time on context switches.
- **Priority:** the highest priority ready process runs. A low priority process can starve unless its priority rises the longer it has waited. That rise is ageing.

## Synchronisation<a name="synchronisation"></a>

Threads that share memory can interleave. A race condition is when the result depends on that order. The critical section is the code that touches the shared data, and it must not run in two threads at once.

### Locks<a name="synchronisation-locks"></a>

- **Mutex:** a lock that is either held or free. A thread locks it before the critical section and unlocks it after. Only one thread holds it.
- **Semaphore:** a counter. Wait decrements it, and the thread blocks if the count is already 0. Signal increments it and wakes a waiter. A binary semaphore behaves like a mutex. A counting semaphore caps how many threads may use a resource at once.

### Deadlock<a name="synchronisation-deadlock"></a>

A deadlock is a set of processes each waiting for a resource held by another in the set. All four of these have to be true at once:

- **Mutual exclusion:** the resource cannot be shared
- **Hold and wait:** a process holds one resource while it waits for another
- **No preemption:** only the holder releases the resource
- **Circular wait:** a cycle of processes, each waiting on the next

Break any one of them and the deadlock cannot form. Taking locks in a fixed order breaks the cycle.

## Memory<a name="memory"></a>

A process does not use physical RAM addresses directly. The OS gives it a virtual address space, and a translation maps those addresses onto real frames.

### Paging<a name="memory-paging"></a>

Virtual memory is split into fixed-size pages. Physical memory is split into frames of the same size. A page table records which frame holds each page.
<br/><br/>

- **Page hit:** the page is already in RAM, so the translation is enough
- **Page fault:** the page is not in RAM. The OS loads it from disk, which is far slower than a memory access
- **Thrashing:** the pages the process needs do not fit, so it spends its time faulting instead of running

The translation lookaside buffer (TLB) caches recent page-table entries. A TLB hit skips the walk of the page table.
