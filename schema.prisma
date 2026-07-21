// Prisma schema for CHOSEN ONE store (PostgreSQL — Vercel production)

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Float
  image       String
  images      String   @default("")
  sizes       String
  category    String   @default("Coleção")
  featured    Boolean  @default(false)
  inStock     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SiteSetting {
  id    String @id @default(cuid())
  key   String @unique
  value String
}

model AuditLog {
  id        String   @id @default(cuid())
  action    String
  entity    String
  entityId  String?
  summary   String
  details   String   @default("{}")
  adminUser String
  createdAt DateTime @default(now())

  @@index([createdAt])
  @@index([entity, action])
}

model ProductClick {
  id        String   @id @default(cuid())
  productId String?
  productName String
  type      String
  size      String?
  createdAt DateTime @default(now())

  @@index([createdAt])
  @@index([productId, type])
  @@index([productName])
}
