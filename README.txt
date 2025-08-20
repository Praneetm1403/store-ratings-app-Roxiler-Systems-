Store Ratings Assignment — Starter Kit

This repository contains:
  - /server : Node + Express + Prisma (PostgreSQL)
  - /client : React (Vite) web app

Quick Start
-----------
Prereqs: Node 18+, PostgreSQL 14+ running locally

1) Backend
   cd server
   cp .env.example .env
   # edit .env DATABASE_URL and JWT_SECRET

   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   npm run dev
   # API: http://localhost:4000

2) Frontend
   cd ../client
   npm install
   # Point frontend to API if needed:
   # echo "VITE_API_URL=http://localhost:4000" > .env
   npm run dev
   # App: http://localhost:5173

Seed accounts
-------------
Admin: admin@example.com / Admin@123
Store Owner: owner@example.com / Owner@123
Normal User: user@example.com / User@1234

Notes
-----
- Validations: Name(20-60), Address(<=400), Email(valid), Password(8-16 incl. uppercase + special)
- Tables: Sorting implemented via clickable table headers; filtering with simple inputs.
- Ratings: Users can submit or modify; owners see average + raters; admin sees dashboards and lists.
