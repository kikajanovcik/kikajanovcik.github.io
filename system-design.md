---
layout: page
title: System design
nav: system
permalink: /system-design
---

## Scalability<a name="scalability"></a>

The scalability of an application can be measured by the number of requests it can effectively support simultaneously.

### Vertical scaling<a name="scalability-vertical"></a>

Achieved by adding more power to the existing machine. In practice this would mean adding better processors, increasing RAM, or other power - increasing adjustments.
<br/><br/>
**Pros:**

- data consistency
- less complex to maintain
- consumes less power
- load balancing unnecessary
- uses inter process communication which is faster

**Cons:**

- single point of hardware failure
- limited scope of upgradeability in the future
- hardware limit
- expensive implementation

### Horizontal scaling<a name="scalability-horizontal"></a>

Achieved by adding more processing units or physical machines to your server or database.
<br/><br/>
**Pros:**

- more resistant to system failures
- cheaper compared to vertical scaling
- easy to upgrade
- supports linear increases in capacity

**Cons:**

- data inconsistency
- utilizes network calls - this will be slower and more to prone failure than the inter process communication
- load balancing required

Scaling can be achieved by:

#### Caching

Caching can help reduce the load in spikes, improve responsiveness and availability of content during network interruptions.

More about cache can be found [here](#cache).

#### Load balancing

Your load balancer acts as a single point of contact for all incoming web traffic to your Auto Scaling group. When an instance is added to your group, it needs to register with the load balancer or no traffic is routed to it.

More about load balancer can be found [here](#load-balancer).

#### Database replication

A process of copying data from a central database to one or more databases

#### Database partitioning

Partitioning is dividing of stored database objects (tables, indexes, views) to separate parts. Partitioning is used to increase controllability, performance and availability of large database objects.

<div class="separator"></div>

## Load Balancer<a name="load-balancer"></a>

- DNS load balancing is achieved with a single name that resolves to multiple names or IP addresses.
- Bridged load balancing uses a virtual IP address created in the same IP network as the real server. Packets designated for the virtual IP addresses are redirected to the real servers.
- Routed load balancing is load balancing at layer three, in which the virtual IP address exists on one network with the real servers existing on one or more other networks.
- Network load balancing allows you to create a cluster of between 2 and 32 web servers, with each having its own computer name and static IP address.

<div class="separator"></div>

## Reverse Proxy<a name="reverse-proxy"></a>

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<div class="separator"></div>

## Cache<a name="cache"></a>

**Memcached:**

Store simple string key / value pairs. Store database resultset object, HTTP api response, or serializable in-memory objects, JSON / XML document as value with a string key, results of page rendering etc.

Cons:

- no persistence
- limits size of data upto 1 MB per key
- Memcached is not good for enterprise use cases. It does not offer many features like automatic elastic cluster management, sophisticated high availability, auto failover, load re-balancing, cross data centre replication etc

**Redis:**

stores all data in memory, essentially redis is a big in-memory dictionary
Support for size of value upto 512 MB per key
Redis pub-sub can be used to broadcast messages to multiple subscribers

**Hazelcast**

in-memory data grid which is a clustered system, highly available & scalable
distributes copies of data across all nodes in the cluster. So if a node goes down, the data is not lost
can grow & scale horizontally

**Couchbase**

NoSQL document store
offers persistence
