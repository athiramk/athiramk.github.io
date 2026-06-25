---
id: routing
title: Routing
excerpt: A Backend Engineer's guide to routing
category: Tech
date: June 25, 2026
---
## What routing actually is

Routing is the mechanism that maps an incoming request (method + path, fundamentally) to the specific piece of code that should handle it. At its core, a router is just a lookup table:

```
GET  /users          → listUsers()
POST /users          → createUser()
GET  /users/{id}     → getUser()
PUT  /users/{id}     → updateUser()
DELETE /users/{id}   → deleteUser()
```

Frameworks (Spring Boot's `@RequestMapping`/`@GetMapping`, Express, etc.) implement this matching efficiently — usually as a tree/trie structure rather than checking every route linearly, since real apps can have hundreds of routes.

## Static routes vs dynamic routes

**Static route** — the path is fixed, matches exactly:
```
GET /users
GET /health
GET /api/v1/products
```

**Dynamic route** — part of the path is a variable, captured and passed to your handler:
```
GET /users/{id}
GET /orders/{orderId}/items/{itemId}
```

In Spring Boot:
```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable String id) { ... }
```

### A subtlety worth knowing: route matching priority

If you have both:
```
GET /users/{id}
GET /users/me
```
Most routers prioritize the **static/literal segment** over the dynamic one — `/users/me` should match the static route, not get captured as `id=me`. But this depends on the framework's matching algorithm and registration order; it's a real source of bugs when routes overlap. Generally: more specific/static routes should be registered (or at least matched) before more general dynamic ones.

## Path parameters vs query parameters

**Path parameter** — part of the URL structure itself, typically identifies *which* resource:
```
GET /users/123
         ^^^ path param: id=123
```
```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable String id) { ... }
```

**Query parameter** — comes after `?`, typically used for filtering, sorting, pagination, optional modifiers — not identity:
```
GET /users?status=active&sort=name&page=2&limit=20
```
```java
@GetMapping("/users")
public List<User> getUsers(
    @RequestParam(required = false) String status,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int limit
) { ... }
```

### The mental rule for choosing between them

> If removing it changes *which resource* you're talking about → path param.
> If removing it just changes *how you view/filter* that resource (and there's a sensible default) → query param.

`GET /users/123` — 123 is essential, identifies a specific user → path param.
`GET /users?role=admin` — optional filter, "give me users" still makes sense without it → query param.

A common mistake: cramming optional/filtering data into the path (`/users/active/admin/page2`) — that should be query params instead. Conversely, putting resource identity into query params (`/users?id=123`) when it should be a path param is also a common smell — it's less RESTful and harder to cache/reason about.

## Nested routes with path params — yes, very common

```
GET    /orders/{orderId}/items                  → list items in an order
GET    /orders/{orderId}/items/{itemId}          → get specific item
POST   /orders/{orderId}/items                   → add item to order
DELETE /orders/{orderId}/items/{itemId}           → remove item from order
```

```java
@RestController
@RequestMapping("/orders/{orderId}/items")
public class OrderItemController {

    @GetMapping("/{itemId}")
    public Item getItem(
        @PathVariable String orderId,
        @PathVariable String itemId
    ) { ... }
}
```

This expresses a genuine **ownership/hierarchy** relationship — an item only makes sense in the context of its order. This is one of the most natural uses of nested path params and shows up constantly in real APIs (your sample request earlier — `/api/v2/orders/12345/items` — was exactly this pattern).

**Watch out for nesting too deep.** `/companies/{id}/departments/{id}/teams/{id}/members/{id}` becomes unwieldy. A common convention: nest one level for ownership/context, but expose deeply-nested resources at their own top-level path with a query param instead once it gets too deep — e.g. `GET /members?teamId=X` rather than 4 levels of nesting.

**Authorization implication worth knowing**: when you have `/orders/{orderId}/items/{itemId}`, you must verify that `itemId` actually *belongs to* `orderId` — not just that both exist independently. This is a classic **IDOR (Insecure Direct Object Reference)** vulnerability if skipped — someone could pass a valid `itemId` that belongs to *someone else's* order.

## API versioning in routing

Three common strategies:

### 1. URI versioning (most common, most visible)
```
GET /api/v1/users
GET /api/v2/users
```
Simple, explicit, cacheable (different URL = different cache entry naturally), easy to route at the gateway/load-balancer level even before it hits your app. Downside: technically the "same resource" now has two different URIs, which is a bit at odds with REST purity — but it's by far the most pragmatic and widely used approach in industry.

### 2. Header-based versioning
```
GET /users HTTP/1.1
Accept: application/vnd.myapi.v2+json
```
or a custom header:
```
X-API-Version: 2
```
"Purer" in REST terms (the URI identifies the resource; the version is just a representation detail, handled via content negotiation). Downside: less visible/discoverable, harder to test quickly in a browser, harder to route at a CDN/gateway level without inspecting headers.

### 3. Query parameter versioning
```
GET /users?version=2
```
Less common, generally considered the weakest option — versioning is meant to be structural, and shoving it in a query param feels like an afterthought; also messier for caching since query params are part of the cache key by default.

In practice, most companies go with **URI versioning** for its simplicity, sometimes combined with header-based versioning for finer-grained internal service-to-service contracts.

## Deprecation in routing

Versioning gets you a new route; deprecation is how you responsibly retire the old one.

**Step 1: Signal deprecation via headers**, while the old route still fully works:
```
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Nov 2026 00:00:00 GMT
Link: <https://api.example.com/v2/users>; rel="successor-version"
```
- `Deprecation` — RFC 8594, signals "this endpoint is deprecated."
- `Sunset` — RFC 8594, signals the actual date it'll stop working.
- `Link` with `rel="successor-version"` — points clients to the replacement.

**Step 2: Monitor usage** — log/metric who's still calling the deprecated route, ideally with a way to attribute it to a specific client/API key so you can directly notify remaining users.

**Step 3: Hard cutoff** — after the sunset date, return `410 Gone` (not `404` — `410` specifically communicates "this used to exist and is intentionally gone," vs `404` which is ambiguous about whether it ever existed).

```
HTTP/1.1 410 Gone

{"error": "This API version was sunset on 2026-11-01. Please migrate to /v2/users."}
```

**Practical pattern**: keep v1 and v2 controllers coexisting in the codebase during the transition (often v1 internally just delegates to v2 logic with a mapping/adapter layer), rather than maintaining truly duplicate business logic — this avoids the bug-fix-in-one-but-not-the-other trap.

## Catch-all routes

A catch-all (a.k.a. wildcard route) matches **anything** that doesn't match a more specific route — used as a fallback.

```java
@RequestMapping("/**")
public ResponseEntity<?> catchAll(HttpServletRequest request) {
    return ResponseEntity.status(404).body("Not found");
}
```

Common real uses:

1. **404 handler** — anything unmatched falls through to a consistent "not found" response rather than the framework's default error page.
2. **SPA (Single Page App) serving** — for a React/Vue frontend with client-side routing, the backend needs to serve `index.html` for *any* path that isn't an API route or static asset, because the actual routing happens in the browser's JS:
   ```
   GET /dashboard/settings  →  (not a real backend route, doesn't matter — serve index.html, let React Router handle it client-side)
   ```
   This is directly relevant to your blog setup, actually — if you ever deploy it behind a custom server (rather than a static host that already handles this), you'd need a catch-all that serves `index.html` for any non-asset path so React Router can take over.
3. **Reverse proxy passthrough** — catch-all routes that forward unmatched paths to another service (API gateway pattern).
4. **Static file serving** — `/static/**` or `/assets/**` catching all sub-paths under a prefix.

### Catch-all and matching order matter a lot

If your catch-all is registered/matched *before* your specific routes, it'll swallow everything and your real routes will never fire. Frameworks generally handle specificity correctly (literal > parameterized > wildcard), but it's worth knowing this is a real footgun, especially with manually-ordered middleware chains (Express) versus annotation-based declarative routing (Spring), where Spring's matching is more automatic but you can still get bitten by overlapping `@RequestMapping` patterns.

## Quick summary table

| Concept | Example | Key point |
|---|---|---|
| Static route | `/health` | Exact match |
| Dynamic route | `/users/{id}` | Captures a variable segment |
| Path param | `/users/123` | Identifies the resource |
| Query param | `/users?status=active` | Filters/modifies, usually optional |
| Nested route | `/orders/{orderId}/items/{itemId}` | Expresses ownership; watch for IDOR |
| URI versioning | `/api/v2/users` | Most common, most visible |
| Header versioning | `Accept: vnd.api.v2+json` | "Purer" REST, less discoverable |
| Deprecation | `Deprecation`, `Sunset`, `Link` headers → eventually `410 Gone` | Signal before you remove |
| Catch-all | `/**` | Fallback for 404, SPA serving, gateways |
