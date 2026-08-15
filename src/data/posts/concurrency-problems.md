---
id: concurrency-problems
title: Concurrency Problems and Traditional Locks
excerpt: Understand the issues during concurrency and how traditional locks tries to resolve it
category: Tech
date: August 15, 2026
---
"I" in ACID is isolation, which is the set of core principles that guarantees database transactions are processed reliably.

In simple terms, isolation ensures that concurrently running transactions do not interfere with one another. It dictates how and when changes made by one transaction become visible to other transactions running at the same time.

## The 3 Core Concurrency Problems

When multiple people change data at the same time, three major issues can happen if isolation is too low:

### Dirty Read: 
Transaction A modifies a row but hasn't saved (committed) it yet. Transaction B reads that modified data. If Transaction A cancels (rolls back) its changes, Transaction B just read fake, non-existent data.

### Non-Repeatable Read: 
Transaction A reads a row. Transaction B modifies or deletes that exact row and commits. Transaction A reads the row again and finds the data has changed or vanished.

### Phantom Read: 
Transaction A queries a _range_ of rows matching a condition (e.g., "all users over age 30"). Transaction B inserts a _brand new_ row that fits that condition. Transaction A runs the same query again and sees a new "phantom" row that wasn't there before.

----------

## How Locks Fix These Problems

Databases use two primary types of locks to manage these situations: **Shared Locks (S-Locks) for reading**, and **Exclusive Locks (X-Locks) for writing**. Multiple transactions can hold shared locks on the same data, but an exclusive lock blocks everyone else.

Isolation levels simply tell the database engine how strictly to apply these locks:

### 1. Read Uncommitted

-   Mechanism: Transactions modifying data take Exclusive Locks. However, reading transactions are allowed to bypass these locks and read the raw data anyway.
-   Result: No protection against Dirty Reads.

### 2. Read Committed

-   Mechanism: When reading a row, the database takes a Shared Lock, reads the data, and instantly releases the lock. Write operations hold Exclusive Locks until the very end.
-   Result: Prevents Dirty Reads because you cannot read a row currently held by a write lock. However, because the read lock is released instantly, another transaction can sneak in and change the row right after, causing Non-Repeatable Reads.

### 3. Repeatable Read

-   Mechanism: The database takes Shared Locks on reads and holds them until the entire transaction finishes.
-   Result: Prevents Non-Repeatable Reads because no one can modify the data you are looking at until you are completely done. However, it only locks the _existing_ rows you touched. It does not lock the gaps between rows, meaning someone can still insert new data, causing Phantom Reads.

### 4. Serializable

-   Mechanism: The database places Range Locks (or Index Locks). It locks not just the rows, but the entire logical criteria or space where new rows could be inserted.
-   Result: Absolute isolation. No dirty reads, no non-repeatable reads, and no phantoms. Transactions run as if they were strictly one after another.

----------

These are traditional locking mechanisms whereas Multi-Version Concurrency Control (MVCC), which avoids using read locks entirely by keeping older versions of rows.