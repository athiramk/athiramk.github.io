---
id: rest-api-design
title: REST API Design
excerpt: Understanding the REST API design standards to develop a consistent style
category: Tech
date: July 7, 2026
---

## 1. Where REST Came From

- **1990** — Tim Berners-Lee starts the World Wide Web to share knowledge globally. In about a year he invents: **URI**, **HTTP**, **HTML**, the first web server, the first web browser, and the first WYSIWYG HTML editor.
- The web then grows exponentially — faster than the original design anticipated — and starts heading toward a scalability breakdown.
- **1993** — **Roy Fielding** (co-founder, Apache HTTP Server project) proposes architectural constraints to fix this. These constraints are the foundation of REST:

| Constraint | What it means |
|---|---|
| **Client–Server** | UI/UX lives on the client; data storage/business logic lives on the server. Lets each evolve independently. |
| **Uniform Interface** | A standardized way for components to talk to each other. Sub-constraints: resource identification, resource manipulation through representations, self-descriptive messages, HATEOAS (hypermedia as the engine of application state). |
| **Layered System** | Architecture is hierarchical; each layer only sees the layer directly below it. Enables load balancers, proxies, etc. without touching core logic. |
| **Cacheable** | Server responses must be explicitly labeled cacheable or not — reduces server load, improves latency. |
| **Stateless** | Every request must carry all the info needed to process it. Server holds no client context between requests → any server can handle any request (this is what makes horizontal scaling / load balancing work). |
| **Code on Demand** *(optional)* | Server can send executable code (e.g. JS) to extend client behavior temporarily. Rarely used explicitly. |

- Fielding and Berners-Lee later co-write the spec for **HTTP/1.1**.
- **2000** — Fielding names this architectural style **REST (Representational State Transfer)** in his PhD dissertation.

### Why "Representational State Transfer"?
- **Representational** — the same resource can have multiple representations depending on the client (JSON for server-to-server, HTML for browser, XML, etc). E.g. a `user` resource → JSON for an API client, HTML for a browser.
- **State** — the current attributes/condition of a resource (e.g. a shopping cart's items, quantities, total).
- **Transfer** — the movement of a resource's representation between client and server, via HTTP methods (GET/POST/PUT/PATCH/DELETE...).

---

## 2. URL Anatomy

```
https://api.example.com/v1/books/harry-potter
└scheme┘└──authority──┘└v┘└──path/resource──┘
```

- **Scheme** — `http` / `https`
- **Authority** — domain (often a dedicated `api.` subdomain)
- **Version** — `/v1`, `/v2` — most APIs version through the route
- **Path/resource** — hierarchical; each `/` = a parent–child relationship between resources
- **Query params** — key-value filters, mostly on GET
- **Fragment** — scrolls the browser to a page section (web pages, not really APIs)

### Rules for path segments
1. **Resource names are always plural** — `/books`, not `/book`, even for a single-resource fetch (`/books/{id}`).
2. **No spaces or underscores.** Use **slugs**: lowercase, spaces → hyphens.
   - `"Harry Potter"` → `harry-potter`
3. `/` implies hierarchy: `/organizations/{id}/projects` reads as "projects under this organization."

---

## 3. Idempotency

**Definition:** performing the same action *N* times has the same effect on server state as performing it once — i.e., no matter how many times the client repeats a call, the side effect doesn't change from the 2nd call onward.

| Method | Idempotent? | Why |
|---|---|---|
| **GET** | ✅ Yes | Pure read, no side effects, regardless of call count. |
| **PATCH** | ✅ Yes | Repeating "set field X to B" leaves the value at B every time. |
| **PUT** | ✅ Yes | Same reasoning — replacing with the same payload repeatedly gives the same end state. |
| **DELETE** | ✅ Yes | First call deletes it; subsequent calls are no-ops (404, but no further state change). |
| **POST** | ❌ No | Each call typically **creates a new resource** — repeating it changes server state every time (a new row/ID each time). |

> Note: idempotency is about *server-side side effects caused by the client's own calls* — not about whether the returned data can change due to someone else's actions in between (e.g. another user creating a resource between two of your GETs doesn't break GET's idempotency).

---

## 4. HTTP Methods — When to Use What

- **GET** — fetch/read. Idempotent.
- **POST** — create a new resource. **Also the catch-all for non-CRUD "custom actions"** (see §7) since POST is the open-ended method in the REST spec.
- **PUT** — full replace of a resource's representation (client must send *every* field).
- **PATCH** — partial update (client sends only the field(s) changing). **This is the one used in practice for most "update" APIs** — PUT is common in principle but less used day-to-day since apps are mostly JSON/SPA-driven now, not classic full-form MPA submissions.
- **DELETE** — remove a resource.

> PUT and PATCH are often used interchangeably in the wild — not fatal, but sticking to the semantic standard avoids confusing consumers, especially on public APIs.

---

## 5. Designing the API — Workflow

1. **Start from the UI/UX (Figma/wireframes)**, not from code. This shows how end users relate to data, which maps down to how resources should look.
2. **Identify resources = nouns** from requirements (talking to product/clients + wireframes). E.g. for a Jira-like tool: `organizations`, `projects`, `tasks`, `users`, `tags`.
3. **Design the DB schema** (separate topic).
4. **Identify actions per resource** — usually the CRUD set: create, get-all, get-one, update, delete — plus any custom actions.
5. **Design the API interface itself** (e.g. in Insomnia/Postman) *before* writing any business logic or picking a language/framework.

---

## 6. CRUD Endpoint Patterns

Using `organizations` as the running example:

| Action | Method | Route | Success code |
|---|---|---|---|
| List all | GET | `/organizations` | 200 |
| Create | POST | `/organizations` | 201 |
| Get one | GET | `/organizations/{id}` | 200 |
| Update (partial) | PATCH | `/organizations/{id}` | 200 |
| Delete | DELETE | `/organizations/{id}` | 204 (no content) |

- List and create share the same route — the **HTTP method** disambiguates which controller handles it.
- Get/update/delete-by-id also share the same route shape — again, method disambiguates.
- POST payload excludes server-managed fields (`id`, `createdAt`, `updatedAt`).
- **201 Created** → response body is the newly created entity.
- **200 OK** → generic success (list, get, patch).
- **204 No Content** → successful delete, empty body.
- **404 Not Found** → only when addressing a *specific* resource that doesn't exist (e.g. `GET /organizations/{deletedId}`). **Never** return 404 for an empty list — an empty list is still a valid, successful response (`200` + `data: []`).

---

## 7. Custom (Non-CRUD) Actions

Some operations don't map to plain CRUD — e.g. **archive an organization** or **clone a project**. Even though "archive" sounds like "update a status field," it's really a custom action because it can trigger a cascade of side effects (cascading deletes, notifications, emails, etc.) that a plain PATCH shouldn't be responsible for.

**Convention:** use POST (REST's open-ended method) with the action name as the last path segment:

```
POST /organizations/{id}/archive
POST /projects/{id}/clone
```

- Response code is **not automatically 201** — it depends on what actually happened server-side. E.g. `archive` → 200 (nothing new created); `clone` → 201 (a new project row was created).

---

## 8. List API Features

### Pagination
- Why: sending an entire large dataset in one response is expensive (serialization cost, network payload, perceived latency) — return it in chunks instead.
- Query params: `limit` (page size), `page` (which chunk).
- **Provide sane defaults** if the client omits them (e.g. `page=1`, `limit=10` or `20`).
- Typical paginated response shape:
```json
{
  "data": [...],
  "total": 5,
  "page": 1,
  "totalPages": 3
}
```
  - `total` = total matching records (independent of current page)
  - `page` = which chunk this response represents
  - `totalPages` = lets the client know when to stop paging (e.g. infinite scroll)

### Sorting
- Params: `sortBy` (field name), `sortOrder` (`asc`/`desc`).
- **Always sort by default even if the client sends nothing** — otherwise response order is arbitrary (DB doesn't guarantee order). Sensible default: `sortBy=createdAt`, `sortOrder=desc` (latest first).

### Filtering
- Pass the field name directly as a query param with the desired value, e.g. `?status=archived`, `?name=org4`.
- Multiple filters can be combined (`?status=active&name=...`).

---

## 9. Cross-Cutting Best Practices

1. **Interactive docs** — set up Swagger/OpenAPI (or similar) early; it's also your test playground and documentation for consumers.
2. **Consistency above all** — same casing (**camelCase** in JSON payloads/responses), same field names for the same concept across every resource (don't call it `description` in one endpoint and `desc` in another), same plural-noun routing, same pagination/sort/filter param names everywhere. Inconsistency forces integrators to guess or read your source.
3. **Sane defaults everywhere** — default page/limit/sort, and sensible default values for optional creation fields (e.g. a new `organization` defaults to `status: active` if the client omits it). Only require what you truly need in a POST payload.
4. **No abbreviations** — `description`, not `desc`. The person integrating your API doesn't have the context you had while designing it.
5. **Design the interface before writing any code**, regardless of language/framework — decide routes, payloads, status codes, and edge-case behavior first (e.g. in Insomnia/Postman), then implement.

---

## Quick Reference Cheat Sheet

- Resource in path → **always plural**
- Slugs → **lowercase + hyphens**, no spaces/underscores
- **GET / PATCH / PUT / DELETE → idempotent. POST → not idempotent.**
- List + Create → same route, different method
- Get-one / Update / Delete → same route, different method
- Non-CRUD action → `POST /resource/{id}/action-name`
- 200 = generic success · 201 = created · 204 = deleted (no body) · 404 = specific resource not found (never for empty lists)
- List responses always include sane pagination/sort defaults
- JSON fields → camelCase, consistent names across all endpoints
