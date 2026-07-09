---
id: database-design
title: Database Design
excerpt: how to design a schema with proper relationships/constraints, and how migrations, indexes, and triggers
category: Tech
date: July 9, 2026
---

*Core idea: databases exist to persist data reliably and let you query it efficiently at scale. This post covers why disk-based relational databases (specifically Postgres) are the default choice for most backend systems, how to design a schema with proper relationships/constraints, and how migrations, indexes, and triggers keep that schema maintainable in production.*

---

## 1. Why Databases Exist

- **Persistence** = storing data so it survives after the program that created it stops running (and across sessions/locations). Without it, a to-do app would reset every time you reopened it.
- **Broad definition:** any structured storage can be called a "database" — a phone contacts list, browser `localStorage`, even a plain text file. The common pattern: some persistent system offering **CRUD** (create, read, update, delete).
- **In a backend/server context**, "database" specifically means **disk-based databases** (HDD/SSD) — not RAM.

### Why disk, not RAM?
| | RAM (primary memory) | Disk (secondary storage) |
|---|---|---|
| Speed | Very fast | Relatively slow |
| Cost/capacity | Expensive, limited (typically 8–128 GB on consumer machines) | Cheap, abundant (512 GB – 2+ TB common) |
| Typical use | Caching (Redis, in-memory caches) | Traditional relational/non-relational databases |

- Since databases need to hold large volumes of data cheaply, they trade some speed for capacity → disk-based storage. Caching layers (Redis etc.) sit in RAM specifically because speed matters more than capacity there.

---

## 2. DBMS (Database Management System)

A DBMS is the software responsible for efficiently storing data **and** providing CRUD access to it. Core responsibilities:

1. **Data organization** — structure data so operations stay efficient at scale.
2. **Access** — provide reliable create/read/update/delete operations.
3. **Integrity** — ensure data is accurate/valid (e.g. a "payment amount" field should reject a string).
4. **Security** — control who can access what (users, roles, permissions).

### Why not just use text files?
| Problem | Why it hurts |
|---|---|
| **Parsing** | Every read requires manually splitting/parsing lines in application code — slow (especially in non-systems languages) and error-prone. |
| **No structure** | Text is unstructured — no way to enforce that a field must be a number, a specific format, etc. |
| **Concurrency** | Two simultaneous writers can silently overwrite each other's changes (classic read-modify-write race) — no consistency guarantee. |

DBMS software solves all three: efficient querying, enforced structure/types, and concurrency control.

---

## 3. Relational vs Non-Relational

| | Relational | Non-Relational (e.g. document stores) |
|---|---|---|
| Structure | Tables, rows, columns; relationships via **foreign keys** | Collections, documents (MongoDB terminology) |
| Schema | **Predefined, strict** — must define columns/types upfront | Flexible — documents in the same collection can differ in shape |
| Query language | SQL | Varies by product |
| Strength | Strong **data integrity**, complex relational queries | Fast prototyping, arbitrary/evolving data shapes |
| Trade-off | Less flexible, slower to change shape | Integrity has to be enforced in application code instead — more error-prone as code changes |
| Good fit example | **CRM** — needs accurate, consistent, relationally-linked customer/sales data | **CMS** — content shape varies wildly (images, embeds, code blocks, etc.) |

---

## 4. Why Postgres (the default recommendation)

1. **Open source & free** — self-hostable, no vendor lock-in.
2. **SQL-standard compliant** — migrating to another SQL database later is relatively painless.
3. **Extensible** — huge feature set (official docs run ~1400 pages), rich extension ecosystem.
4. **Reliable & scalable.**
5. **Strong native JSON support** (`json` / `jsonb` types) — removes the main reason people reach for a non-relational DB "just for flexible data." You can keep structured data relational and still have a JSON column for the genuinely dynamic parts.

> Practical takeaway: unless you're at a scale where a very specific, measured bottleneck points elsewhere, Postgres is a safe first choice for most projects.

*(This note assumes basic SQL/Postgres familiarity — `CREATE TABLE`, `SELECT`, `ORDER BY`, `GROUP BY`, etc. Plenty of free resources exist for that; skipped here to focus on backend-relevant concepts.)*

---

## 5. Postgres Data Types — Quick Reference

| Category | Types | Notes |
|---|---|---|
| **Auto-incrementing IDs** | `serial`, `bigserial` | Integer that auto-increments per insert. Prefer `bigserial` in production for higher capacity. |
| **Integers** | `smallint` < `integer` < `bigint` | Differ only in max capacity. |
| **Exact decimals** | `decimal`, `numeric` | Functionally identical. `decimal(10,2)` = 10 total digits, 2 after the decimal point. **Use for anything where accuracy matters** (e.g. price) — exact representation, no rounding drift across systems. |
| **Floating point** | `real`, `double precision`, `float` | Faster to process, but representation can vary slightly across systems. Fine when small inaccuracies don't matter (e.g. physical dimensions). |
| **Strings** | `char(n)`, `varchar(n)`, `text` | `char(n)` pads with spaces to fixed length — rarely useful (only for genuinely fixed-length codes, e.g. 2-letter weekday codes). `varchar(n)` caps length but doesn't pad. `text` = no length limit. **Recommendation: default to `text`** — Postgres docs themselves say there's no real performance difference vs `varchar`, and a random `varchar(255)` cap (a MySQL-era convention with no real meaning in Postgres) just risks forcing a painful migration later if you need to extend it. Enforce length limits at the application layer instead. |
| **Boolean** | `boolean` | `true`/`false`. |
| **Date/Time** | `date`, `time`, `timestamp`, `timestamptz` (timestamp *with* time zone), `interval` | Use `timestamptz` when time zone matters. |
| **Identifiers** | `uuid` | Popular for primary keys — URL-friendly, globally unique without central coordination. |
| **Semi-structured** | `json`, `jsonb` | `json` stores as plain text; **`jsonb`** stores in Postgres's optimized binary format — better query/index performance. **Default to `jsonb`** unless you have a specific reason not to. |
| **Other** | Arrays (of any type), network address types, MAC address, geometric points, XML | Niche — reach for docs when needed. |

**General string-field rule of thumb:** never `char`; default to `text` over `varchar(255)` unless you specifically need to cap length at the DB level.

---

## 6. Migrations

**Problem migrations solve:** you can't just open a GUI tool and run ad-hoc SQL against production — there'd be no audit trail, no way to track what changed over time, and no way to roll back.

### Structure
```
db/
  migrations/
    20240101120000_create_users_table.sql
    20240102090000_seed_data.sql
    ...
```
- Files are ordered sequentially (numeric counter or timestamp).
- A CLI migration tool (e.g. `dbmate`, `golang-migrate`) reads these files in order and applies them.
- Each file typically has two sections:
  - **Up migration** — the actual change (`CREATE TABLE`, `CREATE INDEX`, `CREATE TYPE`, etc.)
  - **Down migration** — the exact reverse, used to roll back if something breaks in production.
- The tool tracks the current applied version in a dedicated table (e.g. `schema_migrations`) so it knows where to resume.

### Why bother
1. **Change tracking** — migration files live in version control (git) alongside your app code — full history of schema evolution.
2. **Rollback** — if a deploy breaks something, you can revert to a known-good schema state.

### Seeding
- **Seeding** = inserting test/sample data into a dev database for local testing — usually its own migration file, run after schema migrations.
- Not meant for production — production data arrives via normal user flows (signups, form submissions, etc.).

---

## 7. Schema Design Example — Project Management Platform

Tables: `users`, `user_profiles`, `projects`, `tasks`, `project_members`.

### Conventions used throughout
- **Table names: plural, snake_case** (`users`, `user_profiles`) — industry standard, though singular is also seen depending on team convention; just be consistent.
- **Column names: snake_case, lowercase** — Postgres is case-insensitive by default and will silently lowercase unquoted identifiers, so camelCase requires ugly `"quoted"` identifiers everywhere. Avoid the friction — stick to snake_case.
- Every table typically has `id` (primary key), `created_at`, `updated_at` metadata columns.
- **`NOT NULL` should be the default** for the majority of columns (70%+ as a rule of thumb) — only allow `NULL` where a field is genuinely optional. Otherwise buggy application code or scripts can silently insert nulls and corrupt data integrity.

### Enum types — used for constrained value sets
```sql
CREATE TYPE project_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE member_role AS ENUM ('owner', 'admin', 'member');
```
**Why enums over plain `text` + application-level validation:**
1. **Data integrity at the DB level** — inserting/updating an invalid value throws a DB-level error, not just an app-level bug.
2. **Documentation** — anyone reading the migration files later (onboarding, debugging, historical review) can immediately see all valid values for a field, instead of having to trace through application code to reverse-engineer the allowed set.

### Primary keys
- `id uuid PRIMARY KEY DEFAULT gen_random_uuid()` (or equivalent) — Postgres can auto-generate UUIDs on insert.
- `PRIMARY KEY` implicitly enforces **`NOT NULL` + `UNIQUE`**.

### Constraints used
| Constraint | Meaning |
|---|---|
| `NOT NULL` | Column cannot be null. |
| `UNIQUE` | No two rows can share the same value in that column (e.g. `email`). |
| `CHECK (...)` | Custom condition a value must satisfy (e.g. `priority BETWEEN 1 AND 5`). |
| `DEFAULT` | Value used when the client doesn't supply one (e.g. `status DEFAULT 'active'`, `created_at DEFAULT now()`). |
| `FOREIGN KEY ... REFERENCES` | Column must match an existing value in the referenced table's key — protects against orphaned/invalid references. |

### Referential integrity — `ON DELETE` behaviors
| Behavior | Effect when the referenced row is deleted |
|---|---|
| **`RESTRICT`** | Blocks the delete entirely if dependent rows exist (e.g. can't delete a user who still owns projects). |
| **`CASCADE`** | Deletes dependent rows automatically (e.g. deleting a project deletes all its tasks). |
| **`SET NULL`** | Dependent rows' foreign key column is set to `NULL` (e.g. deleting a user unassigns their tasks rather than deleting the tasks). Requires the column to be nullable. |
| **`SET DEFAULT`** | Dependent rows' foreign key column reverts to its default value. |

### Relationship patterns

**One-to-one** (`users` ↔ `user_profiles`)
- Rationale for splitting into a separate table: profile fields (bio, avatar, phone, etc.) change independently of core user data and can grow over time without bloating/migrating the main `users` table repeatedly.
- Implementation: the child table's primary key *is* the parent's foreign key — e.g. `user_profiles.user_id` is both `PRIMARY KEY` and `REFERENCES users(id)`. No separate `id` column needed.

**One-to-many** (`projects` → `tasks`)
- The "many" side holds a foreign key back to the "one" side: `tasks.project_id REFERENCES projects(id)`.
- One project row can be referenced by many task rows.

**Many-to-many** (`users` ↔ `projects`, via `project_members`)
- Needs a **linking table** since a user can belong to many projects and a project can have many users.
- The linking table holds foreign keys to *both* sides: `project_id REFERENCES projects(id)`, `user_id REFERENCES users(id)`.
- **Composite primary key** = `(project_id, user_id)` together — this guarantees a given user can only appear once per project (implicit uniqueness + not-null from being a primary key).
- Extra columns specific to the *relationship itself* (not to the user or the project individually) live here too — e.g. `role` (owner/admin/member) belongs on `project_members`, not on `users`, because it's contextual to "this user in this project."

---

## 8. Writing Queries

### Joins
- Always mentally start from `FROM`, not `SELECT` — it clarifies where the data is actually coming from.
- Use short **aliases** (`u` for `users`, `up` for `user_profiles`) for readability.
- **`LEFT JOIN`** vs **`INNER JOIN`**: use `LEFT JOIN` when the related row might not exist yet (e.g. a user who's never filled out their profile) but you still want the primary row returned. `INNER JOIN` only returns rows where *both* sides match — would silently drop users with no profile row.
- Embedding a related row as JSON in one query (Postgres-specific): `to_jsonb(up.*) AS profile` — lets you return a nested object from a single joined query instead of requiring the client to make two calls.

### Sorting matters — SQL doesn't guarantee order
- Relational databases return rows in **no guaranteed order** unless you explicitly `ORDER BY` something.
- **Default to `ORDER BY created_at DESC`** for list endpoints unless there's a reason otherwise — shows newest first, and guarantees consistent ordering across repeated calls.

### Parameterized queries — security essential
- A **parameterized query** reserves a placeholder slot in the SQL statement; the actual value is supplied separately and is always treated as a literal string/value — **never** interpreted as executable SQL.
- This is the standard defense against **SQL injection** — never build queries by string-concatenating raw user input directly into SQL text.
- In real backend code, your database driver/ORM handles this automatically (e.g. `$1`, `?`, or named parameters depending on language/library) — you should essentially never hand-concatenate SQL with untrusted input.

### Building dynamic list endpoints (filter + sort + paginate)
For a typical "get all X" endpoint, the query is constructed dynamically in application code based on what the client sends:

- **Filtering:** e.g. `WHERE full_name ILIKE :letter || '%'` — `ILIKE` = case-insensitive pattern match; append `%` to match "starts with." Only include the filter clause in the constructed query if the client actually supplied that parameter.
- **Sorting:** `ORDER BY :sort_by :sort_order` — but **never let the client pass an arbitrary column name directly**; validate against an allow-list of sortable fields (e.g. `full_name`, `email`, `created_at`) before interpolating. Default: `sort_by = created_at`, `sort_order = DESC` if the client sends nothing.
- **Pagination:** `LIMIT :limit OFFSET :offset` — `offset = (page - 1) * limit` (DB offset is 0-indexed even though the user-facing `page` param typically starts at 1). Default: `page = 1`, `limit = 10` (or whatever fits your use case) if omitted.

> All three (filter/sort/paginate) should only appear in the final SQL if the corresponding client parameter was actually provided (or a sensible default substituted) — don't leave `NULL` placeholders for absent filters.

### CRUD query shapes recap
- **Create:** `INSERT INTO table (...) VALUES (...) RETURNING *` — returns the newly created row in the same call.
- **Read (single):** `SELECT ... WHERE id = :id` (parameterized).
- **Update (partial):** `UPDATE table SET col1 = :val1, col2 = :val2 WHERE id = :id RETURNING *` — only include `SET` clauses for fields the client actually sent (constructed dynamically, same principle as filtering above).
- **Delete:** standard `DELETE FROM table WHERE id = :id`.

---

## 9. Triggers

**Use case covered:** automatically keeping `updated_at` current without remembering to set it manually in every update query.

- Postgres lets you define a **custom function** that runs on a DB event, then attach it via `CREATE TRIGGER`.
- Pattern: `BEFORE UPDATE` trigger on a table → function sets `NEW.updated_at = now()` → returns the modified row.
- Benefit: this logic lives once, at the database level, instead of being duplicated (and potentially forgotten) across every `UPDATE` statement in application code.

---

## 10. Indexes

### The core idea (book-index analogy)
A book index lets you jump straight to "Chapter 4, page 54" instead of flipping through every page sequentially. A database index does the same thing for rows: it's a **lookup table** mapping a column's values → the physical location of the corresponding row on disk.

### Without an index
A query filtering/joining/sorting on a non-indexed column forces a **sequential scan** — the database checks every row, one at a time, across wherever they physically live on disk. Fine for a handful of rows; very slow at scale (thousands/millions/billions of rows).

### With an index
The database maintains a separate, ordered structure for that column, so it can locate matching rows almost directly instead of scanning everything.

### When to create one — the three signals
Create an index on a column when it's regularly used in:
1. **`JOIN` conditions**
2. **`WHERE` clauses**
3. **`ORDER BY` (sort) conditions**

...**and** the query is called frequently enough that the lookup speed-up is worth the overhead (see below).

> Note: **primary key columns are automatically indexed** by Postgres — you only need to manually index **foreign key columns** and other frequently filtered/sorted/joined-on columns, since those aren't indexed by default.

### Examples from the schema
- `users.email` — indexed (used in joins/where clauses when looking up by email).
- `users.created_at DESC` — indexed (default sort for "list all users").
- `tasks.project_id` — indexed (foreign key, used when joining projects → tasks).
- `tasks.assigned_to` — indexed (foreign key, used when joining users → tasks).
- `tasks.created_at DESC` — indexed (default sort for "list all tasks").
- `tasks.status` — indexed (frequently filtered in `WHERE status = :status`).
- `project_members.project_id`, `project_members.user_id` — indexed (both sides of the linking table's joins).

### The trade-off — indexes aren't free
- Every `INSERT`/`UPDATE` on an indexed column requires the database to also update the index structure — this is **write overhead**.
- **Don't index everything reflexively.** Weigh: how frequently is this query actually run? Is the read speed-up worth the write-time cost at your data volume? Start with the three signals above, monitor real performance, and drop indexes later if they turn out to be unused or not worth the maintenance cost.

---

## Quick Reference Cheat Sheet

- Databases = disk-based (cheap, slower) vs. caches = RAM-based (fast, expensive) — pick based on whether you need capacity or speed.
- Relational (Postgres) = strict schema, strong integrity, SQL. Non-relational (Mongo) = flexible schema, integrity pushed to app code.
- **Default choice: Postgres** — open source, SQL-standard, extensible, reliable, great native JSON (`jsonb`) support.
- String columns: default to **`text`**, avoid `char`, avoid arbitrary `varchar(255)` caps.
- Every table: `id` (PK), `created_at`, `updated_at` — and **`NOT NULL` by default** unless a field is genuinely optional.
- **Enums** for fixed value sets → DB-level integrity + free documentation.
- Relationships: 1:1 → shared PK/FK on child table · 1:many → FK on the "many" side · many:many → linking table with composite PK.
- `ON DELETE`: `RESTRICT` (block) / `CASCADE` (delete dependents) / `SET NULL` / `SET DEFAULT`.
- **Always use parameterized queries** — never string-concatenate user input into SQL (SQL injection risk).
- List endpoints: default to `ORDER BY created_at DESC`; validate `sort_by` against an allow-list; paginate with `LIMIT`/`OFFSET`.
- **Migrations** = versioned, trackable, rollback-capable schema changes, committed to git alongside app code.
- **Triggers** automate cross-cutting row-level behavior (e.g. auto-updating `updated_at`).
- **Index** columns used in `JOIN` / `WHERE` / `ORDER BY` — but only when the query is frequent enough to justify the write-side overhead. Primary keys are indexed automatically; foreign keys are not.
