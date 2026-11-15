# BloodRadar — Technology Stack & Rationale

**Course:** CSE 3292 – Website Development  
**Project:** BloodRadar (Emergency Blood Response Network)  
**Team:** Digital Pioneers  

---

## 1. Technology Overview

| Layer | Technology | Version | Key Rationale |
|---|---|---|---|
| **Frontend Framework** | Next.js (App Router) | 14.2.35 | Server Components for instant load speeds; Server Actions for form handling. |
| **Language** | TypeScript | 5.x | Strict type safety for blood groups, geographic coordinates, and database schemas. |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS for responsive design, dark/light contrast, and high-performance animations. |
| **Icons** | Lucide React | 0.378.0 | Lightweight, accessible SVG icon set. |
| **Validation** | Zod | 3.23.8 | Universal validation for client forms, server actions, and API boundaries. |
| **Database** | PostgreSQL | 15+ | Enterprise-grade ACID compliance and transaction isolation (`SELECT ... FOR UPDATE`). |
| **Spatial Engine** | PostGIS | 3.x | Native spherical geography support (`ST_DWithin`, `ST_Distance`) with GIST indexing. |
| **Background Jobs** | pg_cron | Built-in | Eliminates external cron dependencies; executes scheduler logic directly in database. |
| **Authentication & Realtime** | Supabase | 2.43.4 | SSR authentication, cookie-based sessions, Row Level Security, and WebSocket event bus. |
| **Mapping** | Leaflet + OpenStreetMap | 1.9.4 | Open-source, zero-cost interactive mapping without proprietary API keys. |
| **Deployment** | Vercel | Production | Global Edge Network optimized for Next.js App Router applications. |
