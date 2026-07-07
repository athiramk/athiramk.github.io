---
id: understanding-http
title: Understanding HTTP
excerpt: HTTP essentials to understand web application
category: Tech
date: June 23, 2026
---

*Core idea: HTTP is how clients and servers talk. Two ideas sit at its heart — statelessness and the client–server model. Everything else (headers, methods, status codes, caching, CORS, negotiation) builds on top of those two.*

---

## 1. The Two Core Ideas

### Statelessness
- The server has **no memory of past requests**. Every request must be **self-contained** — it carries everything the server needs (headers, auth tokens, session info) to process it.
- After responding, the server "forgets." A second request from the same client is treated as a brand-new, unrelated event.
- **Benefits:**
  - **Simplicity** — server doesn't need to store/manage session state.
  - **Scalability** — any server in a pool can handle any request (no session affinity needed), which is what makes horizontal scaling / load balancing work cleanly. A server crash doesn't lose "session state" because there wasn't any to begin with.
- Since HTTP itself is stateless, apps layer **state management on top** where needed — cookies, sessions, tokens (for logins, shopping carts, etc.).

### Client–Server Model
- **Client** (browser/app) always **initiates** the request; it must supply everything the server needs (URL, headers, etc.).
- **Server** hosts resources, waits for requests, processes them, and returns a response (HTML, JSON, file, error, etc.).
- HTTP mandates **client-initiated communication** — the server never reaches out first.
- **HTTP vs HTTPS:** safe to treat as interchangeable conceptually — HTTPS = HTTP + encryption/security (TLS/certificates). The extra security layer is a network-engineering topic, not something that changes HTTP's core semantics.

---

## 2. Transport Layer (brief)

- HTTP doesn't strictly require a connection-oriented transport — it just needs **reliability** (no silent message loss).
- Of the two common transport protocols, **TCP** is reliable and connection-based → HTTP relies on TCP (traditionally).
- This sits at **Layer 7 (Application)** of the OSI model; TCP's 3-way handshake etc. are Layer 4 (Transport) — good to know exists, not something you need to master as a backend engineer day to day.

### HTTP Version Evolution
| Version | Key change |
|---|---|
| **HTTP/1.0** | New TCP connection per request — slow, inefficient. |
| **HTTP/1.1** | **Persistent connections** (reuse one TCP connection for multiple req/res), chunked transfer encoding, better caching. |
| **HTTP/2.0** | **Multiplexing** (multiple req/res over one connection), binary framing (not text), header compression (HPACK), server push. |
| **HTTP/3.0** | Built on **QUIC** (over **UDP**, not TCP) → faster connection setup, lower latency, better packet-loss handling, multiplexing without head-of-line blocking (still an issue in HTTP/2). |

---

## 3. Anatomy of an HTTP Message

**Request:**
```
METHOD  /resource/path  HTTP/1.1
Host: example.com
<headers...>

<request body>
```

**Response:**
```
HTTP/1.1  200  OK
<headers...>

<response body>
```

- Request = **method + URL + HTTP version + headers + (blank line) + body**
- Response = **HTTP version + status code + status text + headers + (blank line) + body**
- The blank line marks the end of headers and start of the body.

---

## 4. HTTP Headers

**Definition:** key-value metadata sent alongside a request or response.

**Why headers instead of stuffing everything in the URL/body?** Analogy: a courier reads the *address label on the outside* of a parcel rather than opening it to find the recipient's address — metadata needs to be quickly readable without parsing the whole payload.

### Categories

| Category | Purpose | Examples |
|---|---|---|
| **Request headers** | Tell the server about the client's environment/preferences | `User-Agent` (what kind of client), `Authorization` (bearer token/credentials), `Accept` (expected content type) |
| **General headers** | Metadata about the message itself (request or response) | `Date`, cache directives (`no-cache`, `max-age`), `Connection` (keep-alive/close) |
| **Representation headers** | Describe the body being transmitted | `Content-Type` (JSON/HTML/etc.), `Content-Length` (bytes), `Content-Encoding` (gzip/deflate), `ETag` (caching identifier) |
| **Security headers** | Harden client/server behavior | `Strict-Transport-Security` (HSTS — forces HTTPS, prevents downgrade attacks), `Content-Security-Policy` (restricts script/style/image sources, mitigates XSS), `X-Frame-Options` (prevents iframe embedding, mitigates clickjacking), `X-Content-Type-Options` (prevents MIME sniffing), `Cookie` flags `HttpOnly`/`Secure` (no JS access, HTTPS-only transmission) |

### Two Big Ideas About Headers
1. **Extensibility** — new headers can be added without changing the underlying protocol (e.g. security headers, custom `X-*` headers, content negotiation headers).
2. **Remote control** — headers let the client steer server behavior: content negotiation (`Accept*`), caching (`Cache-Control`/`Expires`), authentication (`Authorization`).

---

## 5. HTTP Methods

Methods express the **intent** of the request.

| Method | Intent | Has body? | Idempotent? |
|---|---|---|---|
| **GET** | Fetch data, no server modification | No | ✅ Yes |
| **POST** | Create data | Yes | ❌ No |
| **PATCH** | Partial update / "append or selectively replace" | Yes | (treated as idempotent in practice) |
| **PUT** | Full replace of the resource | Yes | ✅ Yes |
| **DELETE** | Remove a resource | Usually no | ✅ Yes |
| **OPTIONS** | Ask the server about its capabilities (used in CORS preflight) | No | — |

- **Idempotent** = calling it repeatedly produces the same end result as calling it once.
  - GET → same data every time, no side effects.
  - PUT → replacing with the same payload repeatedly leaves the same end state.
  - DELETE → can only truly delete once; repeat calls don't change state further.
  - POST → **not idempotent** — each call typically creates a *new* resource, so repeating it changes server state every time.
- **Thumb rule:** default to PATCH for updates; only reach for PUT when you specifically want a full replace.

---

## 6. CORS (Cross-Origin Resource Sharing)

- **Same-Origin Policy:** by default, browsers block a web page from making requests to a domain different from the one that served the page.
- **CORS** is the browser-enforced mechanism that lets servers explicitly permit specific cross-origin access.

### Two CORS Flows

#### A. Simple Request Flow
- Applies when the request uses a simple method (GET/POST/HEAD) and only simple headers/content-types.
- Flow: client sends request → browser attaches `Origin` header → server checks the origin against its policy → if allowed, server includes `Access-Control-Allow-Origin` in the response (either the specific origin or `*`) → browser lets the response through.
- If that header is missing/mismatched → browser **blocks** the response (CORS error), even though the server actually responded.

#### B. Preflighted Request Flow
A request is "preflighted" if it's cross-origin **and** any of these are true:
1. Method is **not** GET/POST/HEAD (e.g. PUT, DELETE)
2. Request includes **non-simple headers** (e.g. `Authorization`, custom headers)
3. Content-Type is something other than the simple types (`application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`) — e.g. **`application/json`** (which covers most real-world API traffic)

**Preflight mechanics:**
1. Browser sends an **OPTIONS** request first — no body, just an inquiry. Includes `Origin`, `Access-Control-Request-Method`, and (if relevant) `Access-Control-Request-Headers`.
2. Server responds (typically **204 No Content**) with:
   - `Access-Control-Allow-Origin` — which origin(s) are allowed
   - `Access-Control-Allow-Methods` — which methods are allowed
   - `Access-Control-Allow-Headers` — which non-simple headers are allowed
   - `Access-Control-Max-Age` — how long the browser can cache this preflight result (avoids re-checking on every call)
3. If all conditions are satisfied, the browser fires the **actual** request and processes the real response normally.
4. If the server doesn't return the right headers, the browser blocks the request entirely — the request may never even reach the "real" call.

> Practically: since most modern APIs use JSON bodies and often `Authorization` headers, **most real API calls are preflighted**, not "simple."

---

## 7. HTTP Status Codes

**Why they exist:** a standardized way to communicate outcome without the client having to parse/guess from the response body. Universal across languages/frameworks.

Three-digit codes, categorized by first digit:

| Range | Category |
|---|---|
| 1xx | Informational |
| 2xx | Success |
| 3xx | Redirection |
| 4xx | Client error |
| 5xx | Server error |

### 1xx — Informational (rarely encountered day-to-day)
- **100 Continue** — server received headers, client can proceed to send the body (used in large uploads).
- **101 Switching Protocols** — e.g. upgrading HTTP → WebSocket.

### 2xx — Success
- **200 OK** — generic success (e.g. successful GET).
- **201 Created** — a new resource was created (e.g. successful POST).
- **204 No Content** — success, but nothing to return (e.g. successful DELETE, or a CORS preflight OPTIONS response).

### 3xx — Redirection
- **301 Moved Permanently** — resource permanently relocated; future requests should use the new URL. (e.g. renaming `/user` → `/person` while keeping old links working.)
- **302 Found (Temporary Redirect)** — temporarily served from a different URL; client should keep using the *original* URL going forward. (e.g. a short-lived campaign redirect.)
- **304 Not Modified** — resource hasn't changed since last fetched; client should use its cached copy. Used with conditional GETs (`ETag`/`If-None-Match`, `Last-Modified`/`If-Modified-Since`).

### 4xx — Client Errors (the ones backend engineers deal with most)
- **400 Bad Request** — invalid/illogical data (wrong type, malformed payload).
- **401 Unauthorized** — missing or invalid authentication (e.g. missing/expired JWT).
- **403 Forbidden** — authenticated, but not permitted to perform this action (e.g. user A trying to delete user B's resource).
- **404 Not Found** — resource/URL doesn't exist.
- **405 Method Not Allowed** — wrong HTTP method used for this route (common typo bug — e.g. PATCH sent where only POST is accepted).
- **409 Conflict** — request conflicts with current state (e.g. creating a resource with a name that must be unique but already exists).
- **429 Too Many Requests** — rate limit exceeded.

### 5xx — Server Errors
- **500 Internal Server Error** — unexpected/unhandled exception on the server.
- **501 Not Implemented** — server doesn't support this method/functionality (yet).
- **502 Bad Gateway** — a proxy/load balancer got an invalid response from the upstream server (usually not returned by app code directly — comes from infra like nginx).
- **503 Service Unavailable** — server temporarily can't handle requests (overload, maintenance).
- **504 Gateway Timeout** — proxy didn't get a response from the upstream server within the timeout window.

---

## 8. HTTP Caching

**Idea:** store and reuse previous responses to avoid unnecessary repeat requests → faster loads, less bandwidth, less server load.

### Key headers
- **`Cache-Control`** — e.g. `max-age=10` → how long (seconds) the client may treat this response as fresh.
- **`ETag`** — a hash/identifier representing the exact version of the response.
- **`Last-Modified`** — timestamp of when the resource last changed.

### Flow
1. **Initial GET** → server responds `200` + body + `Cache-Control`, `ETag`, `Last-Modified`.
2. **Subsequent GET** (within cache window) → client sends `If-None-Match: <etag>` and `If-Modified-Since: <timestamp>`.
   - If the resource **hasn't changed** → server responds **`304 Not Modified`** (no body) → client reuses its cached copy.
   - If the resource **has changed** (e.g. after an update request) → server responds **`200`** with the new body and a **new ETag**.

> Note: manually managing ETags/Last-Modified is easy to get wrong in production (forgetting to bump the ETag → stale cache served indefinitely). Client-side libraries like **React Query** offer more flexible, application-controlled caching as an alternative/complement to raw HTTP caching.

---

## 9. Content Negotiation

**Idea:** client and server agree on the best format to exchange data, using headers.

| Type | Header | Example values |
|---|---|---|
| **Media type negotiation** | `Accept` | `application/json`, `application/xml`, `text/html` |
| **Language negotiation** | `Accept-Language` | `en`, `es` |
| **Encoding negotiation** | `Accept-Encoding` | `gzip`, `deflate` |

- The server tries to honor the client's stated preference, falling back to a default if it can't.
- Demonstrated behavior: changing `Accept-Language` from English → Spanish changes the response language; changing `Accept` from JSON → XML changes the response format — same endpoint, same data, different representation.

### HTTP Compression (part of the same topic)
- Client advertises supported encodings via `Accept-Encoding` (e.g. `gzip`).
- Server compresses the response body (`Content-Encoding: gzip`) before sending; browser decompresses transparently.
- **Why it matters:** dramatic size reduction — e.g. an 11,000-row response was **~3.8 MB compressed vs. ~26 MB uncompressed**. Huge bandwidth savings at scale.

---

## 10. Persistent Connections & Keep-Alive

- **HTTP/1.0:** new TCP connection per request/response — slow (connection setup/teardown is expensive).
- **HTTP/1.1:** **persistent connections by default** — one TCP connection is reused across multiple request/response cycles.
- **`Connection: keep-alive`** — explicitly requests the connection stay open; can specify `timeout` and `max` (number of requests) parameters.
- **`Connection: close`** — connection closes after the response (HTTP/1.0 default behavior, can still be forced in 1.1).
- In practice: HTTP/1.1 defaults handle this fine without explicit developer intervention most of the time.

---

## 11. Handling Large Payloads

### Sending large data to the server — Multipart Requests
- Used for file uploads (images, video, audio, etc.).
- `Content-Type: multipart/form-data; boundary=<delimiter>` — the binary file data is sent **in parts**, separated by a **boundary** delimiter string that marks the start/end of each part within the body.

### Receiving large data from the server — Chunked / Streaming
- `Content-Type: text/event-stream` — server streams data to the client in chunks over time rather than sending one giant payload at once.
- `Connection: keep-alive` — keeps the connection open while chunks continue arriving.
- Client appends/accumulates chunks as they arrive to reconstruct the full response.

---

## 12. SSL / TLS / HTTPS — Quick Primer

- **SSL** — the original protocol for encrypting client–server communication. Now considered outdated/insecure.
- **TLS** — the modern replacement for SSL; encrypts data in transit, uses certificates to authenticate the server and establish an encrypted channel, preventing eavesdropping/tampering. Continuously updated (current recommended version referenced: **TLS 1.x**).
- **HTTPS** — HTTP + TLS (historically + SSL). Encrypts the whole communication channel so sensitive data (login credentials, etc.) can't be intercepted.

You don't need to implement any of this yourself day-to-day, but understanding *what problem each layer solves* is enough for backend engineering purposes.

---

## Quick Reference Cheat Sheet

- HTTP is **stateless** (no memory between requests) + **client-initiated** (client always starts the conversation).
- HTTP/1.1 = persistent connections · HTTP/2 = multiplexing + binary framing · HTTP/3 = QUIC/UDP-based.
- Headers = request / general / representation / security.
- Idempotent: **GET, PUT, DELETE** (also PATCH in practice) · Not idempotent: **POST**.
- CORS: simple flow (GET/POST/HEAD + simple headers) vs. **preflighted** flow (OPTIONS first) — most JSON + auth-header APIs are preflighted.
- Status codes: **2xx** success · **3xx** redirect/cache · **4xx** client error · **5xx** server error.
- Caching: `ETag` / `Last-Modified` + `If-None-Match` / `If-Modified-Since` → **304** if unchanged.
- Content negotiation: `Accept`, `Accept-Language`, `Accept-Encoding` → server tailors the response format/language/compression.
- Large uploads → **multipart/form-data** with a boundary; large downloads → **chunked/streamed** responses.
- HTTPS = HTTP + TLS (encryption + server authentication).