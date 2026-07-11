---
id: caching
title: Caching
excerpt: Understand why we need caching and ways to achieve it
category: Tech
date: July 11, 2026
---

*Core idea: caching decreases the time and effort needed to retrieve data or repeat a computation by keeping a smaller, faster-to-access subset of the primary data. It shows up at every layer of computing — network, hardware, and software — and as a backend engineer you'll mostly work with the software layer (in-memory databases like Redis).*

---

## 1. What Caching Is

- **Simple definition:** a mechanism to decrease the time and effort it takes to perform some work.
- **Technical definition:** keeping a **subset** of primary data — chosen based on usage frequency, probability of reuse, recency, etc. — in a location that's faster and easier to access than the primary store.
- **Cache hit** = the requested data *is* found in the cache → return instantly.
- **Cache miss** = the requested data is *not* in the cache → do the full/expensive operation, then store the result in the cache for next time.

### Why it matters
Caching becomes critical wherever an application needs to avoid either:
1. **Repeating heavy computation** (e.g. search ranking, trend analysis), or
2. **Repeatedly sending/serving large volumes of data** (e.g. streaming video).

### Real-world examples
| Platform | What's expensive | What's cached |
|---|---|---|
| **Google Search** | Crawling/indexing/ranking billions of pages per query | Search results, in a **distributed in-memory cache** spread across the world |
| **Netflix** | Serving terabytes of video to millions of global users | Pre-encoded video (multiple resolutions) cached at **edge locations** via CDN, closest to each user |
| **X/Twitter (or any social platform)** | Real-time trend analysis across billions of tweets (heavy ML/compute) | Trending topics, recomputed periodically (e.g. every few minutes) and served from cache since trends don't change second-to-second |

---

## 2. Three Levels of Caching (Backend-Relevant)

| Level | What it covers |
|---|---|
| **Network** | CDN, DNS |
| **Hardware** | CPU caches (L1/L2/L3), RAM |
| **Software** | In-memory key-value stores (Redis, Memcached) — technically still backed by hardware (RAM), but interacted with via software/libraries |

---

## 3. Network-Level Caching

### A. CDN (Content Delivery Network)
**Goal:** cache content on servers geographically close to end users (**edge servers** / **edge nodes**) to minimize latency and reduce load on the origin server.

**Typical flow:**
1. User requests a resource via a URL.
2. Browser sends a **DNS query** to resolve the domain to an IP.
3. The CDN's DNS system routes the request to the nearest **PoP** (**Point of Presence** — a regional cluster of edge servers), based on factors like geographic location and network conditions (e.g. a poor connection might get routed to a PoP serving a lower-quality version).
4. The edge server checks whether the requested content is cached (**hit** or **miss**):
   - **Hit** → serve directly from the edge.
   - **Miss** → fetch from the **origin server** (where the master copy lives), serve it, and cache it at the edge for next time.
5. **TTL (Time To Live)** governs how long content stays cached at the edge before being considered stale and re-fetched from origin.

> Not just Netflix — any static assets (JS/HTML/CSS, images) benefit from CDN caching. Platforms like Vercel run their own edge networks for this reason.

### B. DNS Caching
DNS resolution is itself layered with caching at multiple hops, to avoid repeating the expensive recursive lookup process for every request.

**Full DNS resolution flow (when nothing is cached anywhere):**
1. Browser/device sends the query to a **recursive resolver** (provided by the ISP, or a public resolver like Google DNS / Cloudflare DNS).
2. Recursive resolver checks its **local cache** first.
   - Hit → returns the IP immediately.
   - Miss → queries a **root server** → gets referred to the relevant **TLD (top-level domain) server** (e.g. `.com`) → gets referred to the **authoritative name server** for the specific domain → retrieves the actual IP.
3. Resolver returns the IP up the chain and caches it locally for future queries.

**Caching happens at every layer along this chain:**
- Operating system (checks its own local DNS cache first, before even reaching the ISP resolver)
- Browser (Chrome, Firefox etc. maintain their own DNS cache)
- Recursive resolver (ISP or public DNS provider)
- Sometimes even authoritative name servers cache upstream results

---

## 4. Hardware-Level Caching (Brief)

- CPUs use **L1 → L2 → L3** cache layers (increasingly larger, increasingly shared across cores) to speed up repeated/predictable computations — e.g. sequential array access is fast partly because predictive algorithms preload upcoming memory into cache.
- **RAM (main memory)** sits below CPU caches and above disk in the hierarchy:
  - **Fast** — accessed via direct electrical addressing (hence "random access" — access time is roughly constant regardless of location), unlike a mechanical hard disk.
  - **Limited capacity** and **volatile** (data disappears on power loss) — a deliberate trade-off: speed for capacity/persistence.
- This is exactly why **in-memory databases** (Redis, Memcached) exist and are fast: they store data in RAM, not disk. They still rely on secondary/disk storage behind the scenes for persistence (reloading into RAM on startup), but reads/writes during normal operation hit RAM directly.

---

## 5. Software-Level Caching — In-Memory Key-Value Stores (Redis, Memcached)

**Two defining characteristics:**
1. **In-memory** — stored in RAM, not disk → much faster access than a traditional relational/disk-based database.
2. **Key-value based** — no strict schema like relational databases (no predefined tables/columns). A key maps to a value which can be a string, list, JSON, number, etc. depending on the technology.

> In the cloud context, managed equivalents include things like AWS ElastiCache.

### Caching Strategies

| Strategy | How it works | Trade-off |
|---|---|---|
| **Lazy caching (cache-aside)** | On a request: check cache → hit, return it; miss, fetch from primary storage, store in cache, then return it. | Simple, reactive — you only cache what's actually requested. |
| **Write-through** | Every write (create/update) is applied to the database **and** the cache at the same time, in the same operation. | Cache is always fresh (no stale reads), but every write incurs extra overhead (two writes instead of one). |

### Eviction Policies
Since RAM capacity is limited, once the cache fills up, old entries must be evicted to make room for new ones.

| Policy | Rule |
|---|---|
| **No eviction** | Cache rejects new writes once full (errors out) — effectively "do nothing." |
| **LRU (Least Recently Used)** | Evict whichever entry was accessed longest ago. |
| **LFU (Least Frequently Used)** | Evict whichever entry has been accessed the fewest times overall. |
| **TTL-based** | Evict whichever entry is closest to its configured expiry time. |

---

## 6. Common Backend Use Cases for In-Memory Caching

1. **Expensive/frequent DB query results** — e.g. a heavy multi-join, multi-aggregation SQL query hit frequently by a dashboard or landing page. Cache the result with a TTL (e.g. 1 hour); invalidate/update manually when underlying data changes.
   - E-commerce example: Amazon caching product details, prices, and inventory data for high-traffic items (e.g. during a sale) so millions of concurrent page views don't hammer the database for essentially static content.
   - Social media example: caching user profile data (changes rarely) so high-traffic profile pages (e.g. a celebrity's) don't require a DB hit on every view.
   - **Pattern:** good candidate for caching = **read-heavy, write-infrequent** data.

2. **Session storage** — after authentication, store the session/token in Redis rather than a relational database, since every subsequent authenticated request needs a fast session lookup. Fetching from RAM-backed cache is much faster than a DB round-trip on every request.

3. **External API response caching** — e.g. caching third-party weather API responses with a TTL (e.g. 1 hour) so your backend doesn't re-call the external API for every incoming user request. Reduces cost (billing per call) and avoids hitting rate limits, especially safe when the underlying data doesn't change rapidly.

4. **Rate limiting** — implemented via middleware that inspects a request header (commonly `X-Forwarded-For`, which carries the client's real IP, typically added by a reverse proxy) and tracks a per-IP request counter over a time window (e.g. max 50 requests/minute) in Redis.
   - Counter exceeded → respond with **`429 Too Many Requests`**.
   - **Why Redis instead of a relational DB for this:** a relational DB call on every single request adds unnecessary latency (even 20–30ms matters) and floods the database with pure bookkeeping traffic that has nothing to do with actual business logic. Keeping this in an in-memory store keeps rate-limit checks fast and keeps load off the primary database.

---

## Quick Reference Cheat Sheet

- Caching = store a subset of primary data somewhere faster to access → cache **hit** (found, fast) vs. **miss** (not found, fall back to full operation then store result).
- Use caching when avoiding either **repeated heavy computation** or **repeated large data transfer**.
- Three levels: **Network** (CDN, DNS) → **Hardware** (CPU L1/L2/L3, RAM) → **Software** (Redis/Memcached, in-memory key-value stores).
- CDN: origin server → PoP (cluster of edge servers) → edge cache hit/miss → TTL governs freshness.
- DNS resolution is cached at every hop: OS → browser → recursive resolver → (root → TLD → authoritative server, only on a full miss).
- RAM = fast, limited, volatile · Disk = slow(er), abundant, persistent — hence in-memory DBs for speed, disk DBs for durable bulk storage.
- Redis/Memcached = **in-memory + key-value** (no strict schema).
- Caching strategies: **lazy/cache-aside** (populate on miss) vs. **write-through** (update cache + DB together, always fresh, more write overhead).
- Eviction policies: **no eviction**, **LRU**, **LFU**, **TTL-based**.
- Common backend use cases: expensive/frequent DB query results, session storage, external API response caching, rate-limiting counters.
- Good caching candidate = **read-heavy, infrequently-changing** data.
