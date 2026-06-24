---
id: understanding-http
title: Understanding HTTP
excerpt: HTTP essentials to understand web application
category: Tech
date: June 23, 2026
---
## Core Principles of HTTP
HTTP (Hypertext Transfer Protocol) is an application-layer protocol (Layer 7 in the OSI model) used by clients and servers to communicate. It is built on two fundamental ideas: 

**Statelessness:** 
The server retains no memory of past interactions. Every request is entirely self-contained and must include all the necessary information (like authentication tokens or cookies) for the server to process it. This simplifies server architecture and improves scalability, because a single server doesn't need to keep track of user sessions, and a server crash won't destroy a client's state. 

**Client-Server Model:** 
Communication is always initiated by the client (e.g., a web browser) to request resources or actions, and the server waits for these requests to process and respond. 

## HTTP Versions
Over many versions, HTTP relied on a reliable, connection-based transport protocol TCP (Transmission Control Protocol). However, the latest standard HTTP/3 replaces TCP with QUIC. HTTP has evolved to improve connection resilience and reduce latency.
* *HTTP 1.0:* Opened a new TCP connection for every single request and response, which was highly inefficient and slow. 
* *HTTP 1.1:* Introduced *persistent connections* (`keep-alive`) as the default, allowing multiple requests to be sent over a single reused connection. 
* *HTTP 2.0:* Introduced multiplexing (multiple requests/responses concurrently on one connection), binary framing, header compression, and server push. 
* *HTTP 3.0:* Replaced TCP with QUIC (built over UDP) to establish faster connections and handle packet loss better, eliminating head-of-line blocking.

## Anatomy of HTTP Messages
Client-server communication happens via structured http messages

**Request Message (Client to Server):** 
Contains a Request Method (e.g., GET/POST), the Resource URL, the HTTP version, Host domain, Headers, a blank line, and an optional Request Body.

```http
POST /api/v2/orders/12345/items HTTP/1.1
Host: api.shopstore.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
Accept: application/json
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Content-Type: application/json; charset=utf-8
Content-Length: 87
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abc123signature
Cookie: session_id=a1b2c3d4e5f6; cart_id=98765; theme=dark
Connection: keep-alive
Cache-Control: no-cache
X-Request-ID: 7f9c2a4e-1234-4d56-89ab-cdef01234567
X-Client-Version: 3.2.1
Origin: https://www.shopstore.com
Referer: https://www.shopstore.com/cart
If-None-Match: "etag-abc123"

{"productId": "SKU-9988", "quantity": 2, "giftWrap": true} 
```

**Response Message (Server to Client):** 
Contains the HTTP version, a Status Code (e.g., 200), a Status Value (e.g., OK), Headers, a blank line, and the Response Body. 

```http
HTTP/1.1 201 Created
Date: Tue, 23 Jun 2026 04:12:33 GMT
Server: nginx/1.24.0
Content-Type: application/json; charset=utf-8
Content-Length: 215
Connection: keep-alive
Cache-Control: no-store
ETag: "etag-xyz789"
Location: /api/v2/orders/12345/items/55321
X-Request-ID: 7f9c2a4e-1234-4d56-89ab-cdef01234567
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 998
X-RateLimit-Reset: 1750650000
Access-Control-Allow-Origin: https://www.shopstore.com
Set-Cookie: cart_id=98765; Path=/; HttpOnly; Secure; SameSite=Strict
Vary: Accept-Encoding

{"itemId": "55321", "orderId": "12345", "productId": "SKU-9988", "quantity": 2, "giftWrap": true, "status": "added"}
```

### Request structure
1. **Request line** — `METHOD /path HTTP/version`
   - `POST /api/v2/orders/12345/items HTTP/1.1`
2. **Headers** — `Key: Value` pairs, one per line
3. **Blank line** — separates headers from body (critical, often forgotten)
4. **Body** — the payload (here, JSON)

### Response structure
1. **Status line** — `HTTP/version StatusCode StatusText`
   - `HTTP/1.1 201 Created`
2. **Headers**
3. **Blank line**
4. **Body**


## HTTP Methods and Idempotency
Methods define the semantic *intent* of the client's request.

*   *GET:* Fetches data from the server without modifying anything.
*   *POST:* Submits new data to the server (includes a request body).
*   *PATCH:* Partially updates an existing resource.
*   *PUT:* Completely replaces an existing resource with the provided body.
*   *DELETE:* Removes a resource.
*   *OPTIONS:* Inquires about the server's capabilities (used heavily in CORS).


| Method | Purpose | Safe? | Idempotent? | Has body? |
|---|---|---|---|---|
| **GET** | Retrieve a resource | Yes | Yes | No (technically allowed, but ignored/discouraged) |
| **POST** | Create a resource, or trigger a non-idempotent action | No | No | Yes |
| **PUT** | Replace a resource entirely | No | Yes | Yes |
| **PATCH** | Partially update a resource | No | No* | Yes |
| **DELETE** | Remove a resource | No | Yes | Usually no |
| **OPTIONS** | Inquires about the server's capabilities (used heavily in CORS) | | | |

PATCH *can* be made idempotent depending on how you design it (e.g. "set status to active" is idempotent; "increment counter by 1" is not).

**Safe** = doesn't change server state. 
**Idempotent** = calling it N times has the same effect as calling it once. These two properties matter a lot in practice — they're what let browsers prefetch GETs, what let load balancers/clients safely retry on timeout, and what let you reason about race conditions.
**Idempotency** is a crucial concept here:
*   *Idempotent Methods:* Can be executed multiple times and yield the exact same result on the server state (e.g., GET, PUT, DELETE).
*   *Non-Idempotent Methods:* Running them multiple times creates different results (e.g., submitting a POST request twice creates two separate resources).

### The ones people forget

**HEAD**
Same as GET but returns only headers, no body. Used to check if a resource exists, get its size (`Content-Length`), or check `Last-Modified`/`ETag` — without downloading it. Worth supporting on any GET endpoint; many backend frameworks generate it automatically.

**OPTIONS**
Asks "what can I do with this resource?" — server responds with an `Allow` header listing supported methods. Two practical contexts:
1. **Manual introspection** — rarely called directly by clients in normal app flow.
2. **CORS preflight** — this is the big one. Browsers automatically send an OPTIONS request before certain cross-origin requests (e.g. ones with custom headers, or methods other than GET/HEAD/POST with simple content types). The browser checks the response headers — `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Max-Age` — before it lets the actual request through.

If you've ever had a frontend call your API and seen a CORS error in devtools where the *actual* request never even hits your logs — that's because the OPTIONS preflight failed first. As a backend engineer, you need to make sure OPTIONS is handled (most frameworks do this for you, but reverse proxies/gateways can swallow or misconfigure it).

**TRACE**
Echoes back the request as received, for debugging. Almost never used in modern APIs — actually a security risk (Cross-Site Tracing) so it's commonly disabled at the server/proxy level.

**CONNECT**
Establishes a tunnel, mainly used for HTTPS through proxies. Not something you implement in app-level routing; it's handled at the proxy/infra layer.

### Things worth internalizing

- **PUT vs PATCH vs POST for "create"**: `PUT /users/123` (client picks ID, full replace, idempotent) vs `POST /users` (server picks ID, not idempotent) vs `PATCH /users/123` (partial update). This distinction comes up constantly in API design questions.
- **Idempotency in practice** isn't just theoretical — for POST endpoints handling things like payments, you'll often see an `Idempotency-Key` header pattern (Stripe popularized this) specifically *because* POST isn't idempotent by default, but you need it to behave that way for retries.
- **Method restrictions** are a real attack surface — make sure your routing layer rejects methods you don't explicitly support (a GET-only endpoint accepting POST due to misconfigured routing is a common gap in security reviews).
- **Status code pairing**: POST → `201 Created` + `Location` header; PUT → `200 OK` or `204 No Content`; DELETE → `204 No Content` (or `200` with a body if you want to confirm what was deleted).

## Standardized Status Codes
Status codes are three-digit numbers that act as a universal language to indicate the outcome of a request.
*   *1xx (Informational):* Indicates headers received; client can proceed (e.g., `100 Continue` for large uploads).
*   *2xx (Success):* 
    *   `200 OK`: Successful operation.
    *   `201 Created`: Usually follows a POST request.
    *   `204 No Content`: Successful, but no body to return (used in OPTIONS or DELETE).
*   *3xx (Redirection):*
    *   `301 Moved Permanently`: The resource has a new URL.
    *   `302 Found/Temporary Redirect`: Temporarily forward to a new route.
    *   `304 Not Modified`: Tells the client to use its locally cached version.
*   *4xx (Client Errors):* 
    *   `400 Bad Request`: Invalid data format sent by client.
    *   `401 Unauthorized`: Missing or invalid authentication token.
    *   `403 Forbidden`: Authenticated, but lacks necessary permissions.
    *   `404 Not Found`: Incorrect URL or deleted resource.
    *   `405 Method Not Allowed`: Using the wrong method for a route.
    *   `409 Conflict`: Business logic violation (e.g., duplicate username).
    *   `429 Too Many Requests`: Client has hit rate limits.
*   *5xx (Server Errors):*
    *   `500 Internal Server Error`: An unhandled exception crashed the server.
    *   `501 Not Implemented`: Feature not yet supported.
    *   `502 Bad Gateway` / `504 Gateway Timeout`: Issues originating from proxies or load balancers failing to reach upstream servers.
    *   `503 Service Unavailable`: Server down or under maintenance.
  
## HTTP Headers
Headers are key-value metadata attached to a request or response. They're what make HTTP extensible — instead of changing the protocol itself, you just add a header — and they let clients and servers influence each other's behavior, like negotiating format, validating caches, or enforcing access control.

### Important header categories

| Category | Examples | Purpose |
|---|---|---|
| **General** | `Connection`, `Date`, `Cache-Control` | Apply to the message as a whole |
| **Request-specific** | `Host`, `User-Agent`, `Referer`, `Origin` | Info about the client/request context |
| **Content negotiation** | `Accept`, `Accept-Language`, `Accept-Encoding`, `Content-Type` | What format client wants vs. what's sent |
| **Authentication** | `Authorization`, `Cookie`, `Set-Cookie` | Identity and session |
| **Caching/validation** | `ETag`, `If-None-Match`, `Cache-Control` | Conditional requests, avoid re-fetching unchanged data |
| **CORS** | `Origin`, `Access-Control-Allow-Origin` | Cross-origin permission |
| **Custom/app-specific** | `X-Request-ID`, `X-RateLimit-*`, `X-Client-Version` | App-defined, not part of the core spec (the `X-` prefix is conventional, not required anymore) |
| **Response-only** | `Location`, `Server`, `Vary` | Server identity, redirect target, caching variation |

### A few details worth knowing
- **`Content-Length`** must match the exact byte length of the body — mismatches break parsing.
- **`Location`** appearing on a `201 Created` tells the client where to find the newly created resource.
- **`ETag`/`If-None-Match`** form a pair: client sends back an `ETag` it previously received to ask "has this changed?" — if not, server can reply `304 Not Modified` with no body at all.
- **`Set-Cookie`** can appear multiple times (once per cookie) in a real response — I only included one here for brevity.
- Header names are case-insensitive (`content-type` == `Content-Type`), but conventionally written in Train-Case.
- HTTP/2 and HTTP/3 actually transmit headers in a binary, compressed form (HPACK/QPACK) — the plain-text version above is the HTTP/1.1 representation, which is the easiest to read for learning purposes.

## Cross-Origin Resource Sharing (CORS)
Browsers enforce a Same-Origin Policy, blocking web apps from making requests to different domains (origins). CORS is a security mechanism to bypass this safely.
*   *Simple Requests:* (Usually GET or POST with standard headers/content types). The browser automatically adds an `Origin` header. If the server allows the request, it replies with the `Access-Control-Allow-Origin` header containing the client's domain (or a `*` wildcard). If missing, the browser blocks the response.
*   *Pre-flight Requests:* Triggered if a request uses a non-simple method (PUT/DELETE), requires authorization headers, or uses a `application/json` content type. 
    *   The browser first fires an *OPTIONS* request asking the server if the route supports the intended method and headers.
    *   The server replies with a `204 No Content` status, explicitly listing allowed origins, methods, headers, and a `max-age` to cache this configuration. 
    *   If successful, the browser then sends the actual, original request.

### Why it exists

Browsers enforce the **same-origin policy** — by default, JS running on `https://app.example.com` can't freely call `https://api.example.com`. CORS is the mechanism that lets a server *opt in* to being called from other origins. The preflight is the browser's way of asking permission *before* sending a potentially risky request.

### Step 1: Does the browser even bother with a preflight?

Not every cross-origin request triggers one. The browser skips preflight only for **"simple requests"** — ones that old servers (pre-CORS) could safely receive without knowing anything about CORS. A request is "simple" if **all** of these hold:

- Method is `GET`, `HEAD`, or `POST`
- Only "safe" headers are set (`Accept`, `Accept-Language`, `Content-Language`, `Content-Type` — and `Content-Type` must be one of `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`)
- No custom headers (`Authorization`, `X-Request-ID`, etc.)
- No `ReadableStream` body

The moment you do any of the following, the browser **must** preflight:
- Use `PUT`, `PATCH`, `DELETE`, etc.
- Send `Content-Type: application/json` (this is the one that catches people off guard — almost every modern API does this)
- Send a custom header like `Authorization: Bearer ...` or `X-Request-ID`

So realistically: **almost every real API call from a frontend triggers a preflight**, because JSON bodies and auth headers are the norm.

### Step 2: The browser sends the preflight automatically

You never write this request — the browser generates and sends it before your actual `fetch()`/`XHR` call goes out.

```
OPTIONS /api/v2/orders HTTP/1.1
Host: api.shopstore.com
Origin: https://www.shopstore.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type, authorization
```

Key parts:
- **`Origin`** — where the request is coming from
- **`Access-Control-Request-Method`** — "I'm about to send a POST"
- **`Access-Control-Request-Headers`** — "I'm about to send these custom headers"

This request has **no body**, and importantly — your actual route handler logic (auth checks, DB calls, business logic) should generally **not run** for this. It needs a separate, lightweight responder.

### Step 3: Server responds to the preflight

```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://www.shopstore.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

What each header does:
- **`Access-Control-Allow-Origin`** — must match the requesting origin exactly (or be `*`, but `*` is disallowed if credentials are involved)
- **`Access-Control-Allow-Methods`** — the methods this endpoint actually supports
- **`Access-Control-Allow-Headers`** — confirms it'll accept those custom headers
- **`Access-Control-Allow-Credentials`** — required (`true`) if the actual request will send cookies or `Authorization`; and if this is `true`, `Allow-Origin` **cannot** be `*`
- **`Access-Control-Max-Age`** — how long (seconds) the browser can **cache** this preflight result, so it doesn't re-ask on every single request. 86400 = 24 hours.

`204 No Content` is conventional here since there's nothing to return — just permission.

### Step 4: Browser evaluates the response

This check happens **entirely client-side, in the browser** — your JS code never sees the preflight request/response directly. If the response doesn't grant what's needed (wrong origin, method not listed, header not listed), the browser blocks the real request and your `fetch()` promise rejects with a CORS error. This is the error you see in devtools where there's no useful server-side log — because the real request never left the browser.

### Step 5: If approved, the actual request goes out

```
POST /api/v2/orders HTTP/1.1
Host: api.shopstore.com
Origin: https://www.shopstore.com
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{"productId": "SKU-1"}
```

The server must **again** include `Access-Control-Allow-Origin` (and `Allow-Credentials` if relevant) on this *actual* response — the preflight passing doesn't exempt the real response from needing CORS headers too.

### Practical backend implications

1. **Route the OPTIONS method to a CORS handler, not your business logic.** Most frameworks (Express + `cors` middleware, Spring's `CorsConfiguration`, etc.) do this for you — but if you're behind a custom gateway/API Gateway/Lambda setup, it's easy to forget to wire OPTIONS at all, and then preflight returns 404/403 and everything breaks silently from the frontend's perspective.

2. **Don't reflect `Origin` blindly as `*` if using credentials.** A common misconfigured pattern is "just allow everything" — but browsers reject `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true`. You need to validate the incoming `Origin` against an allowlist and echo back the specific matching origin.

3. **`Access-Control-Max-Age` is a perf lever.** Without it (or with a low value), the browser preflights *every single request*, doubling your request volume for any non-simple call. Setting it sensibly (hours, not seconds) cuts that down a lot — but remember it's capped by the browser (Chrome caps at 2 hours regardless of what you set).

4. **CORS is enforced by the browser, not your server.** Your server's CORS headers are just *information* the browser uses to decide whether to expose the response to JS. A non-browser client (curl, another backend service, Postman) ignores CORS headers entirely — so don't mistake CORS for an actual security control. Authn/authz still needs to happen properly regardless.

5. **Reverse proxies and gateways (nginx, API Gateway, Cloudflare) often need their own OPTIONS handling**, separate from your app code, especially if the proxy short-circuits some requests before they reach your service.

## HTTP Caching
Caching reuses previously downloaded responses to save bandwidth and load times.
*   When a client first fetches a resource, the server responds with the payload alongside three headers: `Cache-Control` (sets max duration), `ETag` (a unique hash of the payload), and `Last-Modified`.
*   On subsequent requests, the client sends conditional headers: `If-None-Match` (carrying the ETag) or `If-Modified-Since`.
*   If the data on the server hasn't changed, the server saves bandwidth by sending an empty `304 Not Modified` response, instructing the browser to use its cached copy. If it has changed, it sends a `200 OK` with the new data and a new ETag.


Caching avoids re-fetching/re-generating a response when nothing has actually changed. There are two separate questions caching has to answer:

1. **Can I skip the network entirely?** (freshness)
2. **If I do go to the network, can the server tell me "nothing changed" cheaply instead of resending the full body?** (validation)

These map to two different mechanisms: **expiration-based caching** and **validation-based caching**. Real systems use both together.

### The players in the chain

A request can pass through multiple caches before hitting your server:

```
Browser cache → CDN/edge cache → Reverse proxy cache (nginx/Varnish) → Your app/origin server
```

Each layer can independently decide to serve from cache or forward the request — which is why cache headers need to be precise about *who* is allowed to cache *what*, *for how long*.

### Mechanism 1: Expiration (skip the network)

Controlled by `Cache-Control` (modern, HTTP/1.1+) and the older `Expires` header.

```
Cache-Control: max-age=3600, public
```

- **`max-age=3600`** — this response is "fresh" for 3600 seconds. Within that window, the cache doesn't even contact the server.
- **`public`** — any cache (browser, CDN, shared proxy) may store this.
- **`private`** — only the end-user's browser may cache it; shared caches (CDNs) must not. Critical for personalized responses.
- **`no-store`** — don't cache this at all, anywhere. Use for sensitive data (banking, auth tokens).
- **`no-cache`** — misleadingly named: it **can** be cached, but must be **revalidated with the server on every use** before being served. This is the "always check, but allow conditional re-use" directive.
- **`s-maxage`** — like `max-age` but only for shared caches (CDNs); lets you set a different freshness window for CDN vs browser.
- **`must-revalidate`** — once stale, must not be used without successful revalidation, even if the network is down (no "serve stale on error" fallback).

#### Flow when fresh

```
Client → GET /product/123
[Browser checks local cache: is it still within max-age?]
→ YES: serve from cache. No network request at all. Instant.
```

This is the cheapest possible outcome — no request even reaches your server logs.

### Mechanism 2: Validation (cheap re-check when stale)

Once a cached response is stale (past `max-age`), the cache doesn't just discard it — it asks the server "is this still good?" using a **validator**. If the server says yes, it sends back a tiny `304 Not Modified` with no body, instead of resending the whole payload.

Two types of validators:

#### ETag (strong validator, preferred)
A hash/fingerprint of the resource content.

**First response:**
```
HTTP/1.1 200 OK
Cache-Control: max-age=3600
ETag: "v2-a1b2c3"

{...full body...}
```

**Once stale, revalidation request:**
```
GET /product/123 HTTP/1.1
If-None-Match: "v2-a1b2c3"
```

**Server compares the ETag to current state:**
- Unchanged → `304 Not Modified` (no body, headers only — saves bandwidth)
- Changed → `200 OK` with new body and new `ETag`

#### Last-Modified (weaker, timestamp-based)
```
HTTP/1.1 200 OK
Last-Modified: Tue, 23 Jun 2026 10:00:00 GMT
```

**Revalidation:**
```
GET /product/123 HTTP/1.1
If-Modified-Since: Tue, 23 Jun 2026 10:00:00 GMT
```

Server checks if it's been modified since that timestamp → `304` or `200`. Weaker because it's only second-resolution and can miss rapid changes — ETag is generally preferred when you can generate one cheaply.

### Putting it together: full lifecycle

```
1. Client requests /product/123 (first time)
2. Server responds: 200 OK, Cache-Control: max-age=3600, ETag: "v2-a1b2c3", + body
3. Cache stores response + validator

--- within 3600s ---
4. Client requests again → cache serves stored copy directly, no network call

--- after 3600s (stale) ---
5. Client requests again → cache must revalidate
6. Cache sends GET with If-None-Match: "v2-a1b2c3"
7a. Server: nothing changed → 304 Not Modified (empty body) → cache refreshes its freshness window, serves stored body
7b. Server: content changed → 200 OK + new body + new ETag → cache replaces stored copy
```

The big win: step 7a is *much* cheaper than re-sending the full payload, even though it still requires a round trip.

### Vary — caching with multiple representations

```
Vary: Accept-Encoding, Accept-Language
```

Tells caches: "the response differs depending on these request headers, so cache separate copies per combination." Forgetting `Vary: Accept-Encoding` is a classic bug — a CDN might cache the gzipped version and incorrectly serve it to a client that didn't ask for gzip.

### Common backend-engineer pitfalls

1. **Caching authenticated/personalized responses as `public`.** If a response varies per user but you mark it `public` without `Vary` on something that distinguishes users (like a cookie or auth header — though `Vary` doesn't work well with those), a CDN can serve User A's data to User B. Use `private` or `no-store` for anything per-user.

2. **Generating ETags expensively.** If computing the ETag costs as much as generating the body, you've lost the benefit. Cheap, deterministic ETags (hash of a DB row's `updated_at` + id, not a hash of the full serialized JSON) are far more useful.

3. **Not setting `Cache-Control` at all.** Without explicit directives, behavior is inconsistent across browsers/proxies/CDNs — they fall back to heuristics (e.g. guessing freshness from `Last-Modified`). Always be explicit for anything that matters.

4. **Cache invalidation on updates.** Expiration-based caching means stale data can linger until `max-age` expires. For data that changes and must be immediately consistent, you either: keep `max-age` short, use a versioned/hashed URL (e.g. `app.a1b2c3.js` — when content changes, the URL changes, so there's nothing to invalidate), or actively purge the CDN cache on write (cache-busting via API call to the CDN).

5. **CDN vs browser caching conflicting.** `s-maxage` lets you, for example, have a CDN cache aggressively (`s-maxage=600`) while browsers must always revalidate (`max-age=0`) — useful when you want a fast purge path at the CDN layer but don't want browsers holding stale copies in local cache indefinitely.

6. **`no-cache` vs `no-store` confusion.** This trips people up constantly — `no-cache` still allows storage, just forces revalidation; `no-store` forbids storage entirely. If you mean "never cache this, period" (tokens, secrets), use `no-store`.

## Content Negotiation and Compression
Clients and servers can negotiate the best format to exchange data.
*   The client sends preferences via `Accept` (e.g., `application/json` vs `application/xml`), `Accept-Language` (e.g., `en` vs `es`), and `Accept-Encoding` (e.g., `gzip`).
*   The server responds with the appropriate format.
*   *Compression:* By negotiating an encoding like `gzip`, a server can drastically compress text responses (e.g., shrinking a 26MB JSON payload down to 3.8MB) to save massive amounts of network bandwidth.

## Handling Large Data Transfers
*   *Large Client Uploads (Images/Video):* Standard JSON is terrible for binary data. Instead, clients use a `multipart/form-data` request. This breaks the file into chunks separated by a unique string delimiter defined in the `boundary` header.
*   *Large Server Downloads:* To prevent timing out, the server streams the file in chunks using `Content-Type: text/event-stream` and `Connection: keep-alive`. The browser continually appends these chunks until the transfer finishes.

Large payloads break the simple "load it all into memory, send one response" model. HTTP has several header-driven mechanisms to handle this efficiently.

### 1. Chunked Transfer Encoding — when you don't know the size upfront

If the server is streaming a response and doesn't know the total size in advance (e.g. generating a large CSV on the fly, streaming a live feed), it can't set `Content-Length`. Instead:

```
HTTP/1.1 200 OK
Transfer-Encoding: chunked
Content-Type: text/csv

1a\r\n
first chunk of data...\r\n
1f\r\n
second chunk of data here...\r\n
0\r\n
\r\n
```

Each chunk is prefixed with its size in hex, followed by `\r\n`, the chunk data, then `\r\n`. A zero-size chunk signals the end. This lets the server start sending before it's finished generating — important for large or unbounded responses.

**Key rule**: `Content-Length` and `Transfer-Encoding: chunked` are mutually exclusive on the same message. If both somehow appear (e.g. due to a misconfigured proxy), this is actually a known HTTP request-smuggling vector — backend engineers should know proxies/load balancers must enforce one or the other, not silently allow both.

### 2. Range Requests — for resuming/partial downloads

Critical for large files (video, downloads, large datasets) — lets a client fetch *part* of a resource, or resume after a failure.

**Server advertises support:**
```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Length: 5242880
```

**Client requests a specific byte range** (e.g. resuming a paused download, or video player seeking):
```
GET /large-video.mp4 HTTP/1.1
Range: bytes=2097152-
```

**Server responds with only that slice:**
```
HTTP/1.1 206 Partial Content
Content-Range: bytes 2097152-5242879/5242880
Content-Length: 3145728
```

- `206 Partial Content` is the status code for a successful range response.
- `Content-Range: bytes start-end/total` tells the client what slice it got and the full size.
- Multiple ranges can even be requested at once (`Range: bytes=0-99,200-299`), returned as `multipart/byteranges`.

If the server *doesn't* support ranges and the client asked for one, it just falls back to `200 OK` with the full body — so clients must check for `206` vs `200`, not assume.

**Validators matter here too**: `If-Range` (paired with `ETag`/`Last-Modified`) lets a client say "resume this download, but only if the file hasn't changed since I started" — otherwise you'd splice together bytes from two different versions of a file.

### 3. Compression — reduce bytes on the wire

```
Accept-Encoding: gzip, br, deflate    (request — what client can decompress)
Content-Encoding: br                  (response — what was actually used)
```

The client lists what it supports, server picks one and labels it. Brotli (`br`) typically compresses better than gzip for text-based payloads (JSON, HTML, CSS, JS). This is orthogonal to chunking — you can have `Transfer-Encoding: chunked` and `Content-Encoding: gzip` simultaneously (compress first, then chunk the compressed stream).

`Vary: Accept-Encoding` matters here too (covered in caching) — so a CDN doesn't serve a gzip response to a client that didn't ask for it.

### 4. Multipart bodies — large uploads with multiple parts

For file uploads (especially multiple files, or file + metadata together):

```
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----Boundary7MA4YWxk

------Boundary7MA4YWxk
Content-Disposition: form-data; name="metadata"
Content-Type: application/json

{"title": "vacation photo"}
------Boundary7MA4YWxk
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

<binary data>
------Boundary7MA4YWxk--
```

The `boundary` header value delimits each part. Each part can have its own headers (`Content-Type`, `Content-Disposition`). This is how large file uploads with accompanying form fields are typically structured.

### 5. Resumable / chunked uploads (large files going *up*)

For uploads too large to send in one shot reliably (mobile networks, huge files), a common pattern (used by Google Drive API, AWS S3 multipart upload, tus.io protocol) is to upload in pieces and track progress with custom headers:

```
PATCH /uploads/abc123 HTTP/1.1
Content-Type: application/offset+octet-stream
Upload-Offset: 5242880
Content-Length: 1048576

<next chunk of bytes>
```

The server tracks how many bytes it's received so far (`Upload-Offset`), and the client can resume from that offset after a network drop instead of restarting the whole upload. This isn't part of core HTTP spec — it's a pattern built on top using custom/standardized-by-convention headers, but it's how most production-grade large upload systems work (S3's multipart upload API is the canonical backend example).

### 6. `Expect: 100-continue` — avoid sending a huge body that'll be rejected

For large uploads, a client can ask the server "are you even going to accept this?" before sending the body:

```
POST /upload HTTP/1.1
Content-Length: 5000000000
Expect: 100-continue
```

Server responds early:
```
HTTP/1.1 100 Continue
```
...or rejects immediately (`401`, `413 Payload Too Large`) **before** the client wastes bandwidth uploading 5GB. Useful for large POST/PUT bodies; not all clients/servers implement it correctly, so it's a "nice when it works" optimization rather than something to rely on.

### Practical backend implications

| Concern | Header tool |
|---|---|
| Streaming unknown-size response | `Transfer-Encoding: chunked` |
| Resumable downloads / video seeking | `Accept-Ranges`, `Range`, `Content-Range`, `206` |
| Reduce payload size | `Accept-Encoding` / `Content-Encoding` |
| Upload too large to reject after the fact | `Expect: 100-continue` |
| Resumable uploads | Custom offset headers (`Upload-Offset` pattern) or multipart upload APIs |
| Avoid serving wrong cached variant | `Vary` |
| Reject oversized payloads explicitly | Respond `413 Payload Too Large` early, ideally before reading full body |

A few things worth flagging as a backend engineer specifically:
- **Don't buffer the whole body in memory** if you can stream it — large file uploads/downloads should be handled with streaming I/O at the framework level (e.g. Spring's `InputStreamResource`, multipart streaming parsers), not `byte[]` loaded entirely into RAM.
- **Set `Content-Length` whenever you know it.** It lets clients show progress bars and lets proxies make better buffering decisions. Only omit it when you genuinely don't know the size (then use chunked).
- **Reverse proxies (nginx) often have body size limits** (`client_max_body_size`) that silently reject large uploads with `413` before your app even sees the request — a common "why is my upload failing with no app logs" bug.

## Security (SSL/TLS & HTTPS)
*   *TLS (Transport Layer Security):* The modern, secure replacement for the outdated SSL protocol.
*   It encrypts data in transit to prevent interception (eavesdropping) or tampering, utilizing certificates to verify the server's identity.
*   *HTTPS:* Simply the standard HTTP protocol wrapped inside a secure TLS connection.
