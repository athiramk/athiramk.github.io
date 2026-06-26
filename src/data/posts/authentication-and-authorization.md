---
id: authentication-and-authorization
title: Authentication and Authorization
excerpt: Understanding authentication and authorization
category: Tech
date: June 26, 2026
---
## The Story of Auth — How We Got Here

Think of this less as a list of technologies and more as a story of **escalating problems, each solved by the next idea**

---

## Chapter 1: The web has no memory (early 1990s–mid 90s)

HTTP was born **stateless** — every request is independent, the server forgets you the instant the response is sent. Great for simple document serving, terrible the moment you want "log in once, stay logged in."

**Problem**: How does a server recognize you on request #2, if it forgot you after request #1?

**Solution: The Cookie (1994, Netscape)** — the browser agrees to hold onto a little piece of data the server hands it, and automatically replay it back on every future request. This wasn't invented *for* auth specifically — it was a general "let the browser remember something for me" mechanism. But it became the obvious place to stash a "this is who's logged in" identifier.

---

## Chapter 2: Don't put trust in the browser's hands (mid-late 90s)

Early on, some sites literally stored "username=athira" in the cookie itself. Obvious problem: a user can edit their own cookies. Anyone could change it to "username=admin."

**Problem**: We need the actual *proof of identity* to live somewhere the user can't tamper with.

**Solution: The Session** — instead of trusting what's in the cookie, the cookie just holds a meaningless random ID (`session_id=a1b2c3`), and the *real* truth — "a1b2c3 belongs to user 42, who is an admin" — lives in a database/memory store on the **server**, where the user can't touch it. The cookie becomes just a claim ticket, not a passport.

This is **stateful authentication**, and it was the default model for the entire server-rendered web era (PHP, JSP, Rails, early everything) — because back then, every app *was* a website rendered by one server talking to one browser. Simple, made sense for that world.

---

## Chapter 3: The world stopped being "one server, one browser" (2000s–2010s)

Three things happened roughly together:
1. **Mobile apps** arrived — they don't naturally handle cookies the way browsers do.
2. **SPAs** (React, Angular) arrived — the frontend and backend became genuinely separate things, often on different domains.
3. **Microservices** arrived — instead of one server, now there are 20, and they all need to agree on who's logged in.

**Problem**: Stateful sessions assume *one shared session store everyone can reach*. With 20 microservices and mobile clients, every single one now has to query that shared Redis/DB on every request just to know who you are. That's a lot of round trips, a lot of shared infrastructure, a real bottleneck at scale.

**Solution: The Token (JWT)** — what if, instead of the server *remembering* you, the proof of who you are travels *with you*, cryptographically sealed so it can't be forged? The server doesn't store anything anymore — it just checks the seal (signature) and trusts what's inside. Any of the 20 microservices can verify it independently, no shared database needed.

This is **stateless authentication** — and notice the trade *we* made: we gave up easy revocation (you can't "delete" a token from a server that never stored it) in exchange for *not needing a server to remember anything at all*. Every major auth decision is a trade-off like this — that pattern repeats throughout this whole story.

---

## Chapter 4: "Just give us your password" became unacceptable (mid 2000s)

Separately from the stateful/stateless story — a different problem was brewing. Early web apps that wanted to integrate with each other (e.g. "let this app post to your Twitter") just asked you for your actual Twitter password. Now that third-party app could do *anything* on your account, forever, until you changed your password (breaking every other app that also had it).

**Problem**: Users needed a way to grant **limited, revocable** access to a third party — without handing over the master key.

**Solution: OAuth (2007, originally born out of Twitter's actual API problem)** — instead of handing over your password, you go log in directly with the *real* service, approve a *specific, limited* permission ("read my contacts," not "be me"), and the third party gets a token scoped to just that. You can revoke it later without touching your password.

**Key thing to remember**: OAuth was built to solve "access delegation," **not** "who are you" — that distinction matters and is the single most commonly confused point in this whole story.

---

## Chapter 5: Everyone built "login with X" differently, badly (early 2010s)

Once OAuth existed, people *also* started using it for "Sign in with Google/Facebook" — but OAuth was never designed to answer "who is this person," only "what can this app access." So every provider duct-taped together their own ad-hoc way of also conveying identity through the OAuth flow. Inconsistent, fragile, redone by every company from scratch.

**Problem**: We need a *standardized* identity layer, not 50 different homemade ones bolted onto OAuth.

**Solution: OIDC (OpenID Connect, 2014)** — literally OAuth, plus one standardized extra thing: an **ID Token** (a JWT) that says "Google vouches that this is user X, with this email." Now "Sign in with Google" works the same way no matter which app you're signing into.

> Remember it as: **OAuth grew up and got a name badge.**

---

## Chapter 6: Meanwhile, machines needed to talk to machines (ongoing, parallel thread)

Not every caller is a human clicking "log in." A backend service calling Stripe's API, or a script hitting a weather API, doesn't need a consent screen or a login redirect — there's no human present at all.

**Solution: The API Key** — the simplest possible answer: a static secret string, handed out once, sent on every request. No flows, no redirects, no sessions. The tradeoff: it's static and dumb — no built-in expiry, no scoping unless *you* build that in, and if it leaks, it's just... compromised, fully, until someone notices and revokes it manually.

This thread never really "evolved into" the others — it stayed deliberately simple because the problem it solves (machine-to-machine, no human, no UI) never needed OAuth's complexity.

---

## Chapter 7: Knowing who you are was never the same question as what you can do (always true, but formalized over time)

All six chapters above are about **authentication** — proving identity. But proving you're "Athira" tells a system nothing about whether Athira should be allowed to delete a billing record. That's a *separate* question, and conflating the two is a classic design mistake.

**Solution: Authorization, and specifically RBAC** — once identity is settled, attach a **role** to the user (`ADMIN`, `EDITOR`, `VIEWER`), and let permissions hang off the *role* rather than the *individual* — because managing permissions for 10,000 individuals doesn't scale, but managing 5 roles does.

**RBAC's own limit**, which is the most recent chapter of this story: roles are *coarse*. "Editor" can edit *all* documents — but what about "edit only documents I own, or that were shared with me"? That's not really a "role" question anymore, it's a *relationship* question (do I own this? was this shared with me?). This is exactly why **ReBAC** (relationship-based) and fine-grained sharing models exist — and it's *literally the problem Canva's permissions team works on*: "can this person edit this specific design," which depends on sharing relationships, not just a static role label.

---

## Authentication vs Authorization — the fundamental distinction

- **Authentication (AuthN)** — "Who are you?" Verifying identity.
- **Authorization (AuthZ)** — "What are you allowed to do?" Verifying permissions, *after* identity is established.

These are sequential and separate concerns: you authenticate once, then every subsequent request gets authorized based on who you proved to be. A system can have great authentication and terrible authorization (e.g. you prove you're a logged-in user, but the API lets you delete any order regardless of ownership — that's an authz failure, the IDOR issue mentioned earlier).

---

## Cookies, Sessions, Tokens — what each one actually is

These three terms get used loosely and conflated a lot, so let's be precise.

### Cookie
A small piece of data the **server asks the browser to store**, via `Set-Cookie`, and the **browser automatically re-sends** on every subsequent request to that domain. A cookie is just a *storage and transport mechanism* — it doesn't inherently mean "session" or "auth." You could store anything in a cookie (theme preference, cart ID, A/B test bucket).

```
Set-Cookie: session_id=a1b2c3; HttpOnly; Secure; SameSite=Strict
```

### Session
A **server-side record** of "this user is logged in," typically stored in memory, a database, or Redis — keyed by a **session ID**. The session ID itself is usually what gets put inside a cookie, so the cookie is the *transport*, and the session is the *actual state* sitting on the server.

```
Browser cookie: session_id=a1b2c3
                      ↓
Server-side store: { "a1b2c3": { userId: 42, role: "admin", loggedInAt: ... } }
```

This is **stateful authentication** — the server has to keep track of every active session.

### Token
A self-contained piece of data (often a **JWT — JSON Web Token**) that *itself* encodes who the user is and what they're allowed to do, **cryptographically signed** so the server can verify it wasn't tampered with — without needing to look anything up in a database.

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiIsInJvbGUiOiJhZG1pbiJ9.signature
   (header)              (payload: userId=42, role=admin)    (signature)
```

This is **stateless authentication** — the server doesn't store anything; it just verifies the signature on each request and trusts the claims inside.

### The key distinction in one line

> **Session = state lives on the server, client holds a reference (session ID).**
> **Token (JWT) = state lives on the client, server just verifies a signature.**

---

## Stateful vs Stateless Authentication

### Stateful (session-based)

```
1. User logs in with credentials
2. Server validates credentials, creates a session record (in Redis/DB), generates session_id
3. Server responds: Set-Cookie: session_id=abc123
4. Browser sends Cookie: session_id=abc123 on every future request
5. Server looks up abc123 in its session store → finds userId=42 → request proceeds
```

**Pros**: Server has full control — can instantly invalidate a session (logout, force-logout, ban a user) just by deleting the record. Sensitive data (roles, permissions) never leaves the server.

**Cons**: Every request requires a session-store lookup (extra latency, extra infra — usually Redis). Doesn't scale horizontally as cleanly — if you have multiple backend instances, they all need access to the same shared session store (or you need sticky sessions, which has its own tradeoffs).

**Why it was the default for a long time**: it's how the web worked historically (server-rendered apps, no SPAs/mobile apps needing to carry tokens around) — cookies + server sessions just naturally fit the browser-server model.

### Stateless (token-based, typically JWT)

```
1. User logs in with credentials
2. Server validates credentials, generates a signed JWT containing { userId: 42, role: "admin", exp: ... }
3. Server responds with the token (in body, or a cookie)
4. Client sends Authorization: Bearer <token> on every future request
5. Server verifies the signature (cheap, cryptographic, no DB lookup) → trusts the claims → request proceeds
```

**Pros**: No server-side storage needed — scales horizontally trivially (any backend instance can verify any token independently, no shared session store needed). Works naturally for mobile apps, third-party API consumers, microservices (a token can be passed between services without each one needing access to a shared session store).

**Cons**: **You can't easily revoke a token before it expires** — since the server isn't tracking active tokens, "logging out" doesn't actually invalidate anything server-side by default. Workarounds exist (short expiry + refresh tokens, maintaining a blocklist of revoked token IDs — which reintroduces some statefulness) but it's a real architectural tradeoff, not a free lunch. Also, the token's payload is **not encrypted by default** — anyone can base64-decode a JWT and read its contents (the signature only proves it wasn't *tampered with*, not that it's secret) — so never put sensitive data like passwords in a JWT payload.

**Why it was developed**: as APIs needed to serve mobile apps, SPAs, and third-party integrations — not just browser-rendered pages — and as systems moved toward horizontally-scaled microservices, the "every request needs a DB lookup" cost of stateful sessions became a real bottleneck, and not every client is even a browser that handles cookies naturally. JWTs let you decentralize verification.

### Access tokens + refresh tokens — the common compromise

To balance "stateless and fast" against "can't easily revoke," the standard pattern is:
- **Access token** — short-lived (minutes), used for actual API calls, stateless verification.
- **Refresh token** — longer-lived, stored more securely, used only to get a *new* access token when the old one expires. Refresh tokens are often tracked server-side (making them effectively stateful), so revocation is possible there even if access tokens themselves can't be revoked early.

This is the architecture behind almost every "login once, stay logged in for weeks" experience you've used.

---

## OAuth — what it actually solves (and what it's NOT)

**OAuth is an authorization delegation protocol — not an authentication protocol**, even though it gets used in auth flows constantly. This distinction trips a lot of people up, including in interviews.

### The problem it was built for
Before OAuth, if app X wanted to access your Google Contacts, you'd have to give X your actual Google password. X could then do *anything* your Google account could do — way too much trust, no way to revoke access without changing your password entirely.

### What OAuth actually does
It lets you grant a **third-party app limited, revocable access to specific resources**, without ever handing over your credentials.

```
1. You click "Connect Google Drive" in some app
2. App redirects you to Google's login/consent screen
3. You log in to Google (the app never sees your password) and approve specific scopes 
   (e.g. "read your files" — not full account access)
4. Google redirects back to the app with an authorization code
5. App exchanges that code (server-to-server) for an access token
6. App uses that access token to call Google's API on your behalf, scoped to what you approved
```

This is exactly the mechanism behind the MCP/Google Drive connectors mentioned earlier in this conversation, by the way — "Connect Google Drive" is literally this OAuth flow happening.

**Key point**: OAuth answers "what is this app allowed to access on my behalf," not "who are you." That's why a separate layer was needed for actual identity.

---

## OIDC (OpenID Connect) — authentication, built on top of OAuth

OIDC adds an **identity layer on top of OAuth's delegation mechanism**. It's literally OAuth + a standardized **ID Token** (a JWT) that says who the user actually is.

```
Same flow as OAuth, but the token response also includes:

id_token: <JWT containing { sub: "user-unique-id", email: "...", name: "...", iss: "accounts.google.com" }>
```

This is what powers **"Sign in with Google / GitHub / Microsoft"** — the app isn't (primarily) asking for access to your Drive files, it's asking "confirm to me who this person is," and Google/GitHub vouches for that identity via the signed ID token.

### Why this was developed
OAuth alone left every provider inventing its own ad-hoc way to also convey identity (since OAuth itself wasn't designed for that) — OIDC standardized it so any client could implement "login with X" against any OIDC-compliant provider the same way.

> **OAuth = delegated access ("can this app read my files?")**
> **OIDC = delegated identity ("who is this person, according to Google?")**

---

## API Keys

A simple, static credential, usually a long random string, issued to a client (often another service or a developer), sent with every request:

```
GET /api/data HTTP/1.1
Authorization: Bearer sk_live_4eC39HqLyjWDarjtT1zdp7dc
```
or
```
X-API-Key: sk_live_4eC39HqLyjWDarjtT1zdp7dc
```

### Why/where it's used
Built for **service-to-service or developer-to-API** scenarios where there's no real "user login" flow — think calling Stripe's API, a weather API, etc. Simpler than OAuth (no redirect flows, no consent screens), but also much less granular and harder to scope/rotate safely if not designed carefully.

**Key tradeoffs**:
- No built-in expiry or scoping unless you design it yourself (vs. OAuth's structured scopes/expiry).
- If leaked (committed to a public repo — extremely common real-world incident), the key is fully compromised until manually revoked. This is why API keys are typically **prefixed and identifiable** (`sk_live_...`) so leaked-key scanners (GitHub's own secret scanning, for instance) can detect and flag them.
- Good practice: per-key scopes/permissions, rate limiting per key, ability to rotate without downtime (issue a new key, support both briefly, revoke the old one).

---

## Do you build this yourself, or use external providers?

**Almost always, use an external/managed provider for anything user-facing.** Implementing auth correctly (password hashing, session fixation prevention, OAuth flow edge cases, token revocation, MFA, account recovery) is genuinely hard to get fully right, and getting it wrong is a severe security risk — this is one of the few areas where "don't reinvent the wheel" is close to an absolute rule in industry, not just a preference.

### For OAuth / OIDC (social login, SSO)
- **Auth0** (Okta-owned) — very common in mid-size companies
- **Okta** — enterprise-heavy
- **AWS Cognito** — common if you're already on AWS
- **Firebase Authentication** — common for smaller/startup apps
- **Keycloak** — open-source, self-hosted, popular when you want full control without paying a SaaS vendor (common in enterprises with compliance requirements that prefer self-hosting)
- The actual identity providers themselves — **Google, GitHub, Microsoft, Apple** — for "Sign in with X" buttons specifically (these are the OIDC providers being delegated *to*, regardless of which of the above libraries/services you use to integrate with them)

### For stateful session-based auth
Less commonly "outsourced" entirely since it's relatively simple to implement, but the **session store** (Redis, typically) is the part you'd use a managed service for (AWS ElastiCache, Redis Cloud) rather than rolling your own.

### For stateless token-based (JWT) auth
Frameworks provide strong building blocks rather than full managed services: **Spring Security** (with `spring-security-oauth2-resource-server` for JWT validation) handles signature verification, expiry checks, claims extraction — you're not hand-rolling JWT parsing/validation logic yourself. The *issuing* of tokens is often still delegated to Auth0/Cognito/Keycloak rather than self-built.

### For API keys
Typically self-implemented (it's just a random string + a lookup table mapping key → client + permissions + rate limit), though API gateway products (AWS API Gateway, Kong, Apigee) provide built-in API key management, rotation, and rate-limiting if you don't want to build that layer yourself.

### The realistic professional pattern
> Build your own user/permission model and business logic, but **delegate the actual credential verification and identity flows** (password storage, OAuth dance, MFA, social login) to a provider like Auth0/Cognito/Keycloak, and use **Spring Security** to integrate and enforce it at the application layer.

---

## Authorization and RBAC

Once you know *who* someone is (authentication done), authorization decides *what they can do*.

### RBAC — Role-Based Access Control

Instead of assigning permissions to individual users one by one, you define **roles**, attach **permissions** to roles, and assign **roles** to users:

```
Role: ADMIN       → permissions: [read:users, write:users, delete:users, read:billing]
Role: EDITOR       → permissions: [read:users, write:users]
Role: VIEWER       → permissions: [read:users]

User: Athira → role: EDITOR → effectively has [read:users, write:users]
```

```java
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/users/{id}")
public void deleteUser(@PathVariable String id) { ... }
```

**Why RBAC was developed**: assigning permissions per-user doesn't scale — with 10,000 users you'd be managing 10,000 individual permission sets. Roles let you manage permissions at a much smaller, more maintainable scale (a handful of roles), and onboarding/offboarding becomes "assign/remove a role" instead of micromanaging individual grants.

### RBAC's limitation, and what comes after it

RBAC struggles with **context-dependent** rules — "a user can edit *their own* posts, but not other people's" isn't expressible cleanly with roles alone (everyone with the EDITOR role can edit *all* posts under pure RBAC). This is where you graduate to:

- **ABAC (Attribute-Based Access Control)** — decisions based on attributes of the user, resource, and context (e.g. "allow edit if `resource.ownerId == user.id`, or if `user.department == resource.department`"). More flexible, more complex to reason about and audit.
- **ReBAC (Relationship-Based Access Control)** — permissions based on relationships between entities (e.g. "can edit if user is a *member* of the team that owns this document") — this is the model behind Google Docs sharing, and notably, behind Canva's own sharing/permissions systems (relevant, given your T&E SuperGroup target role works directly in that domain).

In practice, most real systems use **RBAC for coarse-grained access** (admin panel vs regular user) layered with **resource-level ownership checks in business logic** (the IDOR-prevention check from earlier — "does this orderId actually belong to this user") for fine-grained control, rather than going all-in on a pure ABAC/ReBAC framework unless the permission model is genuinely complex (which, notably, is exactly the kind of system a "sharing/permissions domain" team would be building).

### Where authorization is enforced — multiple layers, defense in depth

```
1. Gateway/edge level    — coarse checks (is there a valid token at all?)
2. Framework level       — @PreAuthorize, route guards (role/permission checks)
3. Business logic level  — does this specific resource belong to this specific user?
4. Database level        — row-level security (Postgres RLS, for example) as a last-resort safety net
```

A system that only checks authorization at the route/framework level and never re-verifies ownership in business logic is exactly how IDOR vulnerabilities happen — this connects directly back to the nested-route ownership point from the routing discussion.

---

## Quick summary table

| Concept | What it is | Primary use case |
|---|---|---|
| **Cookie** | Browser-stored data, auto-sent by browser | Transport mechanism (for session ID, preferences, etc.) |
| **Session** | Server-side record of logged-in state | Stateful auth |
| **Token (JWT)** | Self-contained signed claims | Stateless auth |
| **Stateful auth** | Server tracks every session | Easy revocation, server-rendered apps, simpler infra |
| **Stateless auth** | Server verifies signature only | Horizontal scaling, mobile/SPA/microservices |
| **OAuth** | Delegated *access* | "Let this app read my Drive files" |
| **OIDC** | Delegated *identity* (OAuth + ID token) | "Sign in with Google" |
| **API Key** | Static credential | Service-to-service, developer API access |
| **RBAC** | Roles → permissions → users | Coarse-grained access control |
| **Authorization (general)** | What you're allowed to do | Enforced at gateway, framework, and business-logic layers |

---
