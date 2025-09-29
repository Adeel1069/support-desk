# Support Desk Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## How To Run

To run this project locally, follow these steps:

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version >= 20.0.0
- **npm**: Version >= 10.0.0

### Steps

```bash
git clone

cd support-desk

npm install

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Prisma Commands

```bash
npm install prisma --save-dev

npx prisma@latest init // (Only once)

npx prisma migrate dev --name init // Run below command after schema.prisma (init only once on first time)

npx prisma generate // To generate prisma client

npx prisma studio // For prisma studio
```

## Rules

### Public and Private routes rules:

#### Public routes

- Whenever you create a new public route (e.g., /sign-in), add it to the publicRoutes array in constants.ts.
- This ensures consistent handling of routes that do not require authentication.

#### Private routes

- Private routes must always be defined under the appropriate role-based prefix:
  - /user/dashboard/... → for regular users
  - /agent/dashboard/... → for agents/staff
  - /admin/dashboard/... → for administrators
- When adding a new private route, ensure it is placed under the correct role-based prefix
- Avoid mixing roles — each route must clearly belong to a single role.
