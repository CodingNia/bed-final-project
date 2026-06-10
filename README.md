# ShortStay API

REST API voor een online booking app gebouwd met Express.js, Prisma en SQLite.

## Live API

https://shortstay-api-ue77.onrender.com

## Tech stack

- Express.js
- Prisma ORM
- SQLite
- JWT authenticatie
- bcrypt wachtwoord hashing
- Winston logging
- Sentry error tracking

## Endpoints

- POST /login
- GET/POST /users
- GET/PUT/DELETE /users/:id
- GET/POST /hosts
- GET/PUT/DELETE /hosts/:id
- GET/POST /properties
- GET/PUT/DELETE /properties/:id
- GET/POST /bookings
- GET/PUT/DELETE /bookings/:id
- GET/POST /reviews
- GET/PUT/DELETE /reviews/:id

## Lokaal draaien

npm install
npm run dev

## Database resetten

npm run reset-db

## Tests draaien

npm run reset-db && npm test
