# Pharma Inventory SaaS - Folder Structure

## Root Structure
```
pharma-inventory-saas/
├── apps/
│   ├── web/                    # Next.js frontend
│   └── api/                    # NestJS backend
├── packages/
│   ├── shared/                 # Shared types, DTOs, contracts
│   ├── database/               # Prisma schema, migrations
│   └── eslint-config/          # Shared linting rules
├── services/
│   ├── ai-service/             # Python FastAPI (separate)
│   └── iot-ingestion/          # MQTT ingestion service
├── docker-compose.yml
├── package.json
└── README.md
```

## Frontend Structure (apps/web/)
```
apps/web/
├── src/
│   ├── app/                    # Next.js 13+ app router
│   │   ├── (auth)/            # Auth-protected routes
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   ├── batches/
│   │   │   ├── quality/
│   │   │   └── recalls/
│   │   ├── auth/              # Login/logout pages
│   │   ├── api/               # API routes (if needed)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── forms/             # React Hook Form components
│   │   ├── tables/            # Data tables with sorting/filtering
│   │   ├── charts/            # Dashboard charts
│   │   └── layout/            # Navigation, headers, sidebars
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-inventory.ts
│   │   └── use-permissions.ts
│   ├── lib/
│   │   ├── api.ts             # TanStack Query setup
│   │   ├── auth.ts            # Auth utilities
│   │   ├── utils.ts           # General utilities
│   │   └── validations.ts     # Zod schemas
│   ├── store/                 # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── ui-store.ts
│   │   └── filters-store.ts
│   └── types/                 # Frontend-specific types
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Backend Structure (apps/api/)
```
apps/api/
├── src/
│   ├── main.ts                # Bootstrap application
│   ├── app.module.ts          # Root module
│   ├── common/                # Shared utilities
│   │   ├── decorators/        # Custom decorators
│   │   ├── filters/           # Exception filters
│   │   ├── guards/            # Auth & RBAC guards
│   │   ├── interceptors/      # Logging, transform interceptors
│   │   ├── pipes/             # Validation pipes
│   │   └── utils/             # Helper functions
│   ├── config/                # Configuration
│   │   ├── database.config.ts
│   │   ├── auth.config.ts
│   │   └── app.config.ts
│   ├── modules/
│   │   ├── auth/              # Authentication & authorization
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── guards/
│   │   │   └── strategies/
│   │   ├── users/             # User management
│   │   ├── tenants/           # Multi-tenant management
│   │   ├── products/          # Product master data
│   │   ├── batches/           # Batch management
│   │   ├── inventory/         # Inventory movements & stock
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.service.ts
│   │   │   ├── inventory.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── quality/           # QC & batch release
│   │   ├── recalls/           # Recall management
│   │   ├── warehouses/        # Warehouse/location master
│   │   ├── suppliers/         # Supplier master data
│   │   ├── customers/         # Customer/distributor master
│   │   ├── audit/             # Audit logging
│   │   ├── files/             # File management (S3/Blob)
│   │   └── events/            # Event-driven architecture
│   ├── database/              # Database utilities
│   │   ├── prisma.service.ts
│   │   └── migrations/
│   └── types/                 # Backend-specific types
├── test/                      # E2E tests
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Shared Package (packages/shared/)
```
packages/shared/
├── src/
│   ├── types/                 # Shared TypeScript types
│   │   ├── auth.types.ts
│   │   ├── inventory.types.ts
│   │   ├── batch.types.ts
│   │   └── api.types.ts
│   ├── dto/                   # Data Transfer Objects
│   │   ├── inventory.dto.ts
│   │   ├── batch.dto.ts
│   │   └── auth.dto.ts
│   ├── enums/                 # Shared enums
│   │   ├── stock-status.enum.ts
│   │   ├── user-roles.enum.ts
│   │   └── movement-type.enum.ts
│   ├── constants/             # Shared constants
│   └── validations/           # Zod schemas for validation
├── package.json
└── tsconfig.json
```

## Database Package (packages/database/)
```
packages/database/
├── prisma/
│   ├── schema.prisma          # Main Prisma schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Database seeding
├── src/
│   ├── client.ts              # Prisma client setup
│   └── types.ts               # Generated types
├── package.json
└── tsconfig.json
```
