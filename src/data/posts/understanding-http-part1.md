---
id: understanding-http-part1
title: Understanding HTTP - Part 1 Basics
excerpt: Essentials to understand web application
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
Over many versions ,HTTP relied on a reliable, connection-based transport protocol TCP (Transmission Control Protocol). However, the latest standard HTTP/3 replaces TCP with QUIC. HTTP has evolved to improve connection resilience and reduce latency.
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