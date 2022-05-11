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

A process of copying data from a central database to one or more databases.

#### Database partitioning

Partitioning is dividing of stored database objects (tables, indexes, views) to separate parts. Partitioning is used to increase controllability, performance and availability of large database objects.

<div class="separator"></div>

## Load Balancer<a name="load-balancer"></a>

Load Balancer helps to spread the traffic across a cluster of servers and also keeps track of the status of all the resources while distributing requests. Typically a load balancer sits between the client and the server accepting incoming network and application traffic and distributing the traffic across multiple backend servers using various algorithms.
<br/><br/>
The load balancer can be a single point of failure; to overcome this, a second load balancer can be connected to the first to form a cluster. Each LB monitors the health of the other and, since both of them are equally capable of serving traffic and failure detection, in the event the main load balancer fails, the second load balancer takes over.

![Load Balancer](/assets/img/loadbalancer.png)

**Health Checks:** Load balancers should only forward traffic to “healthy” backend servers. To monitor the health of a backend server, “health checks” regularly attempt to connect to backend servers to ensure that servers are listening. If a server fails a health check, it is automatically removed from the pool, and traffic will not be forwarded to it until it responds to the health checks again.
<br/><br/>
Load balancing assigninment methods:

- **Least Connection Method:** directs traffic to the server with the fewest active connections. This approach is quite useful when there are a large number of persistent client connections which are unevenly distributed between the servers.
- **Least Response Time Method:** directs traffic to the server with the fewest active connections and the lowest average response time.
- **Least Bandwidth Method:** selects the server that is currently serving the least amount of traffic measured in megabits per second (Mbps).
- **Round Robin Method:** cycles through a list of servers and sends each new request to the next server. It is most useful when the servers are of equal specification and there are not many persistent connections.
- **Weighted Round Robin Method:** designed to better handle servers with different processing capacities. Each server is assigned a weight (an integer value that indicates the processing capacity). Servers with higher weights receive new connections before those with less weights and servers with higher weights get more connections than those with less weights.
- **IP Hash:** a hash of the IP address of the client is calculated to redirect the request to a server.

Load balancing techniques:

#### DNS load balancing

DNS load balancing is achieved with a single name that resolves to multiple names or IP addresses.
<br/><br/>
**Pros:**

- Easy to configure and understand.
- DNS based cluster nodes don’t require multiple network interface cards (NICs). Each machine can have a single NIC with a unique IP address.
- Multiple IP addresses can be assigned to the host record. The DNS server can rotate these addresses in a round-robin manner and workload gets divided equally among the members of the Exchange Server cluster.
- Load balancing pools for various geographic regions are established. The administrator can take advantage of infrastructure dispersed geographically and improve performance by reducing the distance between the receivers and data centers.

**Cons:**

- No native failure detection or fault tolerance and no dynamic load re-balancing.
- No capability other than round-robin.
- No way to ensure connection to the same server twice, if required.
- DNS cannot tell if a server has become unavailable.
- Cannot take into account the unknown percentage of users who have DNS data cached, with varying amounts of Time to Live (TTL) left. So, when TTL times out, visitors may still be directed to the ‘wrong’ server.
- Load may not be evenly shared as DNS cannot tell how much load is present on the servers.
- Each server requires a public IP address.

#### Bridged load balancing

Bridged load balancing uses a virtual IP address created in the same IP network as the real server. Packets designated for the virtual IP addresses are redirected to the real servers.
<br/><br/>
**Pros:**

- Can be embedded into an existing network with no additional IP networks required.
- Could be easier to understand for simple networks.
- Usually cheaper than a routed model.

**Cons:**

- Usually limited to a single local network.
- Layer-2 issues including loops and spanning-tree problems can appear if balancing solution is not designed carefully.
- Can be more difficult to understand for people used to layer-3 environments.
  <br/><br/>

#### Routed load balancing

Routed load balancing is load balancing at layer three, in which the virtual IP address exists on one network with the real servers existing on one or more other networks.
<br/><br/>
**Pros:**

- Allows real servers to be geographically diverse providing expandability.
- Easier to comprehend for people used to layer-3 environments.
- No spanning-tree issues.

**Cons:**

- Layer-3 load balancing can be costly.
- Requires additional IP address and network design to implement.

#### Network load balancing

Network load balancing allows you to create a cluster of between 2 and 32 web servers, with each having its own computer name and static IP address.
<br/><br/>
**Pros:**

- NLB provides fault tolerance at the network layer ensuring that connections are not directed to a server that is down.
- Good for scalability as it supports up to 32 servers per segment.
- NLB is easily configurable.
- No special hardware is required. Two network adapters can be used to mitigate a point of failure.

**Cons:**

- Unable to detect if a server is unavailable and can direct a user to a system that can’t provide the requested service.
- There is no shared data.
- NLB does not work with Layer three switches or Token Ring adapters.
- All servers in a cluster must be in the same subnet.

<div class="separator"></div>

## Reverse Proxy<a name="reverse-proxy"></a>

A reverse proxy is a server that sits in front of web servers and forwards client (e.g. web browser) requests to those web servers. Requests from clients are forwarded to a server that can fulfill it before the reverse proxy returns a server's response to the client. Reverse proxies are typically implemented to help increase security, performance, and reliability. 
<br/><br/>
The difference between a _forward_ and _reverse proxy_ is subtle, but important. A simplified way to sum it up would be to say that a forward proxy sits in front of a client and ensures that no origin server ever communicates directly with that specific client. On the other hand, a reverse proxy sits in front of an origin server and ensures that no client ever communicates directly with that origin server.
<br/><br/>
One of the easiest and most cost-effective ways to reap all the benefits of a reverse proxy is by signing up for a CDN service, for example, the Cloudflare CDN.

![Reverse Proxy](/assets/img/reverseproxy.png)

<div class="separator"></div>

## Cache<a name="cache"></a>

**Memcached:**

Store simple string key / value pairs. Store database resultset object, HTTP api response, or serializable in-memory objects, JSON / XML document as value with a string key, results of page rendering etc.
<br/><br/>
**Cons:**

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

<div class="separator"></div>

## Databases<a name="databases"></a>

### Relational Database Management System (RDBMS)<a name="databases-rdbms"></a>

A relational database like SQL is a collection of data items organized in tables.
<br/><br/>
**ACID** is a set of properties of relational database transactions.

- **Atomicity:** the execution of each transaction can be modeled as a single operation although it can also contain multiple queries. If one of the queries in a transaction fails, the whole transaction is aborted leaving the database status unchanged.
- **Consistency:** the status of the database after each transaction should remain consistent.
- **Isolation:** if multiple transactions are accessing the same data at the same time (concurrently), the resulting database status should be the same as if the transactions were executed serially.
- **Durability:** after successful commit, the status should be persistent even in case of failure.

There are many techniques to scale a relational database: master-slave replication, master-master replication, federation, sharding, denormalization, and SQL tuning.

#### Master-slave replication

The master serves reads and writes, replicating writes to one or more slaves, which serve only reads. Slaves can also replicate to additional slaves in a tree-like fashion. If the master goes offline, the system can continue to operate in read-only mode until a slave is promoted to a master or a new master is provisioned.

![Master-slave replication](/assets/img/master-slave-replication.png)

**Cons:**

- Additional logic is needed to promote a slave to a master.

#### Master-master replication

Both masters serve reads and writes and coordinate with each other on writes. If either master goes down, the system can continue to operate with both reads and writes.

![Master-master replication](/assets/img/master-master-replication.png)

<br/><br/>
**Cons:**

- Requires a load balancer and new logic to determine where to write.
- Most master-master systems are either loosely consistent (violating ACID) or have increased write latency due to synchronization.
- Conflict resolution necessary as more write nodes are added and as latency increases.

#### Master-slave & master-master replication

**Cons:**

- Potential loss of data if the master fails before any newly written data can be replicated to other nodes.
- Writes are replayed to the read replicas. If there are a lot of writes, the read replicas can get clogged and can't do as many reads.
- Similarly, the more read slaves, the more you have to replicate, which leads to greater replication lag.
- Replication adds more hardware and additional complexity.

#### Federation

Federation (or functional partitioning) splits up databases by function. For example, instead of a single, monolithic database, you could have three databases: forums, users, and products, resulting in less read and write traffic to each database and therefore less replication lag. 

Smaller databases result in more data that can fit in memory, which in turn results in more cache hits due to improved cache locality. With no single central master serializing writes you can write in parallel, increasing throughput.
<br/><br/>
**Cons:**

- Federation is not effective if your schema requires huge functions or tables.
- You'll need to update your application logic to determine which database to read and write.
- Joining data from two databases is more complex with a [server link](https://stackoverflow.com/questions/5145637/querying-data-by-joining-two-tables-in-two-database-on-different-servers).
- Federation adds more hardware and additional complexity.

#### Sharding

Sharding distributes data across different databases such that each database can only manage a subset of the data. Taking a users database as an example, could be by user's last name initial or their geographic location; and as the number of users increases, more shards are added to the cluster.
<br/><br/>
Similar to the advantages of federation, sharding results in less read and write traffic, less replication, and more cache hits. Index size is also reduced, which generally improves performance with faster queries. If one shard goes down, the other shards are still operational, although you'll want to add some form of replication to avoid data loss. Like federation, there is no single central master serializing writes, allowing you to write in parallel with increased throughput.

![Sharding](/assets/img/sharding.png)

**Cons:**

- You'll need to update your application logic to work with shards, which could result in complex SQL queries.
- Data distribution can become lopsided in a shard and therefore could result in increased load to that shard compared to others.
- Rebalancing adds additional complexity. A sharding function based on [consistent hashing](https://www.paperplanes.de/2011/12/9/the-magic-of-consistent-hashing.html) can reduce the amount of transferred data.
- Joining data from multiple shards is more complex.
- Sharding adds more hardware and additional complexity.

#### Denormalization

Denormalization attempts to improve read performance at the expense of some write performance. Redundant copies of the data are written in multiple tables to avoid expensive joins. Some RDBMS such as PostgreSQL and Oracle support materialized views which handle the work of storing redundant information and keeping redundant copies consistent.
<br/><br/>
Once data becomes distributed with techniques such as federation and sharding, managing joins across data centers further increases complexity. Denormalization might circumvent the need for such complex joins.
<br/><br/>
In most systems, reads can heavily outnumber writes 100:1 or even 1000:1. A read resulting in a complex database join can be very expensive, spending a significant amount of time on disk operations.
<br/><br/>
In comparison, in a normalized database, we might have a `courses` table and a `teachers` table. Each entry in `courses` would store the `teacherID` for a `course` but not the `teacherName`. When we need to retrieve a list of all courses with the teacher name, we would do a join between these two tables. If a teacher changes his or her name, we only have to update the name in one place.
<br/><br/>
**Cons:**

- Data is duplicated.
- Constraints can help redundant copies of information stay in sync, which increases complexity of the database design.
- A denormalized database under heavy write load might perform worse than its normalized counterpart.

### SQL Tuning<a name="databases-rdbms-sqltuning"></a>

SQL performance tuning consists of making queries of a relation database run as fast as possible with a set of practices that makes uses of a wide array of techniques, tools, and processes.
<br/><br/>
It's important to benchmark and profile to simulate and uncover bottlenecks.

- **Benchmark** - Simulate high-load situations with tools such as ab.
- **Profile** - Enable tools such as the slow query log to help track performance issues.

#### Tighten up the schema

- MySQL dumps to disk in contiguous blocks for fast access.
- Use CHAR instead of VARCHAR for fixed-length fields. CHAR effectively allows for fast, random access, whereas with VARCHAR, you must find the end of a string before moving onto the next one.
- Use TEXT for large blocks of text such as blog posts. TEXT also allows for boolean searches. Using a TEXT field results in storing a pointer on disk that is used to locate the text block.
- Use INT for larger numbers up to 2^32 or 4 billion.
- Use DECIMAL for currency to avoid floating point representation errors.
- Avoid storing large BLOBS, store the location of where to get the object instead.
- VARCHAR(255) is the largest number of characters that can be counted in an 8 bit number, often maximizing the use of a byte in some RDBMS.
- Set the NOT NULL constraint where applicable to improve search performance.

#### Use good indices
- Columns that you are querying (SELECT, GROUP BY, ORDER BY, JOIN) could be faster with indices.
- Indices are usually represented as a self-balancing B-tree that keeps data sorted and allows searches, sequential access, insertions, and deletions in logarithmic time.
- Placing an index can keep the data in memory, requiring more space.
- Writes could also be slower since the index also needs to be updated.
- When loading large amounts of data, it might be faster to disable indices, load the data, then rebuild the indices.

#### Avoid expensive joins
- Denormalize where performance demands it.
  
#### Partition tables
- Break up a table by putting hot spots in a separate table to help keep it in memory.
  
#### Tune the query cache
- In some cases, the query cache could lead to performance issues.

### NoSQL<a name="databases-nosql"></a>

NoSQL is a collection of data items represented in a key-value store, document store, wide column store, or a graph database. Data is denormalized, and joins are generally done in the application code. Most NoSQL stores lack true ACID transactions and favor eventual consistency.
<br/><br/>
**BASE** is often used to describe the properties of NoSQL databases. In comparison with the CAP Theorem, BASE chooses availability over consistency.

- **Basically available**: the system guarantees availability.
- **Soft state**: the state of the system may change over time, even without input.
- **Eventual consistency**: the system will become consistent over a period of time, given that the system doesn't receive input during that period.
