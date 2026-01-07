import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Core modules
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { AuditModule } from './modules/audit/audit.module';

// Master data modules
import { ProductsModule } from './modules/products/products.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { CustomersModule } from './modules/customers/customers.module';

// Core business modules
import { BatchesModule } from './modules/batches/batches.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { QualityModule } from './modules/quality/quality.module';
import { RecallsModule } from './modules/recalls/recalls.module';

// Supporting modules
import { FilesModule } from './modules/files/files.module';
import { EventsModule } from './modules/events/events.module';

// Guards and interceptors
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

// Configuration
import { databaseConfig } from './config/database.config';
import { authConfig } from './config/auth.config';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig],
    }),

    // Core infrastructure
    DatabaseModule,
    AuditModule,
    EventsModule,

    // Authentication & authorization
    AuthModule,
    UsersModule,
    TenantsModule,

    // Master data
    ProductsModule,
    WarehousesModule,
    SuppliersModule,
    CustomersModule,

    // Core business logic
    BatchesModule,
    InventoryModule,
    QualityModule,
    RecallsModule,

    // Supporting services
    FilesModule,
  ],
  providers: [
    // Global guards (applied to all routes)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Ensure user is authenticated
    },
    {
      provide: APP_GUARD,
      useClass: TenantGuard, // Ensure tenant context is set
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Enforce RBAC permissions
    },
    // Global interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor, // Log all operations for compliance
    },
  ],
})
export class AppModule {}
