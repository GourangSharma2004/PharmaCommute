import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Soft delete helper - sets deletedAt instead of hard delete
   * Used across all entities for audit compliance
   */
  async softDelete(model: string, where: any) {
    return this[model].update({
      where,
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Get active records only (not soft deleted)
   * Used in all queries to exclude deleted records
   */
  getActiveRecords(model: string, args: any = {}) {
    return this[model].findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  }
}
