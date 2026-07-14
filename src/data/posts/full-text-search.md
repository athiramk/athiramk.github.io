---
id: full-text-search
title: Full Text Search & Elasticsearch
excerpt: Understand the what is full text search and why we need them
category: Tech
date: July 14, 2026
---

*Core idea: naive substring search (`LIKE '%term%'`) works fine at small scale but breaks down badly as data grows — it's slow and has no concept of relevance. Full-text search engines (Elasticsearch and friends) solve both problems using an **inverted index**, and add relevance scoring, typo tolerance, and speed that scale to millions of records.*

---

## 1. The Problem — Why Naive Search Breaks Down

### The 2005 e-commerce story
- At small scale (~5,000 products), a query like:
  ```sql
  SELECT * FROM products WHERE name LIKE '%laptop%' OR description LIKE '%laptop%';
  ```
  returns results in ~50ms. Simple, works fine.
- As the catalog grows to millions of products, the same query starts taking **30+ seconds** — customers and management get frustrated.
- New requirements emerge that plain `LIKE` search can't satisfy:
  1. **Speed at scale** — sub-second results regardless of data size.
  2. **Relevance ranking** — a search for "laptop" should surface a MacBook Pro before a laptop *bag*; the most relevant result should come first, not in random order.
  3. **Typo tolerance** — "laptp" should still return laptop results.

### The librarian analogy
- Think of a relational database as a **librarian who knows exactly where every book is** — but to answer "find me books about machine learning," they must walk every shelf, checking every single book's title/content one by one.
  - **Problem 1 — speed:** this is a full **sequential scan** — fine for a small library, painfully slow for millions/billions of "books" (rows).
  - **Problem 2 — no concept of relevance:** the librarian has no way to know that a book *titled* "Introduction to Machine Learning" is far more relevant than a book that merely mentions "machine learning" once on its last page. Both come back in arbitrary order.
- `ILIKE '%term%'`-style queries are exactly this librarian's approach applied to a database: thorough, but slow and relevance-blind.

### Historical context
- Around 2005, the "information explosion" hit — Google indexing billions of pages, Amazon cataloging millions of products, LinkedIn indexing millions of profiles. None of these companies could tolerate multi-second search latency (even ~2 seconds is considered bad by modern standards).
- The solution built on **decades of information-retrieval research going back to the 1960s** — not a brand-new idea, but a proven one being productized at internet scale.

---

## 2. The Key Idea — Inverted Index

**The flip:** instead of scanning every document to check whether a term appears in it, **pre-build an index that maps each term → the list of documents (and positions) where it appears.** Then a search becomes a fast lookup instead of a scan.

### Librarian analogy, inverted
When books first arrive on the shelf, extract every word and record which books (and which pages) each word appears in:

| Term | Appears in |
|---|---|
| **machine** | *Introduction to Machine Learning* (pages 1, 15, 23), *The Machine Age* (pages 5, 89), *Coffee Machine Manual* (page 1) |
| **learning** | *Introduction to Machine Learning* (pages 1, 16, 24), *Learning to Cook* (2 places), *Deep Learning Fundamentals* (3 places) |

Now a query for "machine learning" is a direct lookup against this table instead of a page-by-page scan of every book in the library — this is why it's called an **inverted index**: normally you go content → terms; here you go terms → content.

### Underlying technology
- This inverted-index approach is what powers **Elasticsearch**, built on top of **Apache Lucene** — the core inverted-index search library.
- Elasticsearch isn't the only option: **modern Postgres also has native full-text search support**.

---

## 3. Relevance Scoring (BM25)

Beyond just finding matches fast, tools like Elasticsearch rank results by relevance using an algorithm called **BM25**, considering factors like:

| Factor | What it measures |
|---|---|
| **Term frequency** | How often the search term appears *within a given document*. |
| **Document frequency** | How common the term is *across all documents* (rarer terms that match are weighted more meaningfully than very common ones). |
| **Document length** | Short vs. long documents are weighted differently — a short doc where the term appears matters more proportionally than a long one. |
| **Field boosting** | A term matching in the **title** is weighted more relevant than matching in the **description**, which is weighted more than matching in the general **content**. This weighting is configurable — you define your own field-boosting priorities in the query. |

> In Elasticsearch terminology, each searchable record is called a **document** (a JSON object, conceptually similar to a MongoDB document).

**Practical takeaway:** you don't need to deeply understand BM25's internals to use it effectively — treat it as "know when to reach for the tool, then follow the docs for the specific feature you need" rather than something to master from first principles (unlike core database knowledge, which the video stresses *is* worth mastering deeply).

---

## 4. Key Use Cases

1. **Fast, relevant search-as-you-type ("type-ahead") experiences** — e.g. Amazon/Google-style search boxes that return ranked, relevant suggestions as the user types.
2. **Typo tolerance** — e.g. searching "treading today" still correctly surfaces "trending today" results, because the engine derives likely intent from context rather than requiring an exact substring match.
3. **Log management** — Elasticsearch is also foundational to the **ELK stack** (**E**lasticsearch, **L**ogstash, **K**ibana), a very common combination for searching, aggregating, and visualizing logs at scale. If your company already runs ELK for log management, it often makes sense to reuse Elasticsearch for full-text search needs too, rather than introducing Postgres full-text search as a second system.

---

## 5. Postgres Full-Text Search vs. Elasticsearch — When to Choose Which

| | Postgres full-text search | Elasticsearch |
|---|---|---|
| Setup overhead | None — already in your existing DB | Separate service/infrastructure to run and maintain |
| Good fit when | You want full-text search without adding a new system to your stack | You already use Elasticsearch (e.g. for ELK log management), or need more advanced full-text features/scale |
| Both support | Fast lookup instead of full scan, decent relevance ranking | Same, generally with more tuning/feature depth |

---


## Quick Reference Cheat Sheet

- `LIKE`/`ILIKE '%term%'` = sequential scan — fine at small scale, degrades badly as data grows, and has **zero concept of relevance**.
- **Inverted index** = term → list of (document, location) instead of document → terms. This single flip is what makes full-text search fast.
- Elasticsearch is built on **Apache Lucene** (the underlying inverted-index engine); **Postgres also has native full-text search**.
- Relevance scoring (**BM25**) factors: term frequency, document frequency, document length, **field boosting** (title > description > content, configurable).
- Elasticsearch's big wins over naive `LIKE`: **speed at scale**, **relevance ranking**, **typo tolerance**.
- Also powers the **ELK stack** for log management — a strong reason to default to Elasticsearch if it's already in your stack.
- Choose **Postgres full-text search** to avoid adding new infra when requirements are modest; choose **Elasticsearch** for heavier search needs or when you already run it for logging.
- As a backend engineer: treat Elasticsearch as a well-documented tool to reach for and configure via docs/snippets when the use case fits — unlike core relational database mastery, deep internals knowledge isn't the priority here.
