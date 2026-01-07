import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface AuditContext {
  tenantId: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogEntry {
  entityType: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Log a single audit event
   * Called by the AuditInterceptor or manually for critical operations
   */
  async logEvent(context: AuditContext, entry: AuditLogEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          tenantId: context.tenantId,
          userId: context.userId,
          entityType: entry.entityType,
          entityId: entry.entityId,
          action: entry.action,
          oldValues: entry.oldValues || null,
          newValues: entry.newValues || null,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      // Audit logging should never fail the main operation
      // Log the error but don't throw
      console.error('Failed to create audit log:', error);
    }
  }

  /**
   * Log multiple audit events in a batch
   * Useful for complex operations that affect multiple entities
   */
  async logBatch(context: AuditContext, entries: AuditLogEntry[]): Promise<void> {
    try {
      const auditRecords = entries.map(entry => ({
        tenantId: context.tenantId,
        userId: context.userId,
        entityType: entry.entityType,
        entityId: entry.entityId,
        action: entry.action,
        oldValues: entry.oldValues || null,
        newValues: entry.newValues || null,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        timestamp: new Date(),
      }));

      await this.prisma.auditLog.createMany({
        data: auditRecords,
      });
    } catch (error) {
      console.error('Failed to create batch audit logs:', error);
    }
  }

  /**
   * Get audit trail for a specific entity
   * Critical for regulatory compliance and investigations
   */
  async getEntityAuditTrail(
    tenantId: string,
    entityType: string,
    entityId: string,
    limit: number = 100
  ) {
    return this.prisma.auditLog.findMany({
      where: {
        tenantId,
        entityType,
        entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get audit logs for a user (who did what)
   * Useful for user activity monitoring and compliance
   */
  async getUserAuditTrail(
    tenantId: string,
    userId: string,
    fromDate?: Date,
    toDate?: Date,
    limit: number = 100
  ) {
    const whereClause: any = {
      tenantId,
      userId,
    };

    if (fromDate || toDate) {
      whereClause.timestamp = {};
      if (fromDate) whereClause.timestamp.gte = fromDate;
      if (toDate) whereClause.timestamp.lte = toDate;
    }

    return this.prisma.auditLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get comprehensive audit report for compliance
   * Includes all activities within a date range
   */
  async getComplianceAuditReport(
    tenantId: string,
    fromDate: Date,
    toDate: Date,
    entityTypes?: string[]
  ) {
    const whereClause: any = {
      tenantId,
      timestamp: {
        gte: fromDate,
        lte: toDate,
      },
    };

    if (entityTypes && entityTypes.length > 0) {
      whereClause.entityType = {
        in: entityTypes,
      };
    }

    return this.prisma.auditLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: [
        { timestamp: 'desc' },
        { entityType: 'asc' },
        { entityId: 'asc' },
      ],
    });
  }

  /**
   * Helper method to create audit-friendly data snapshots
   * Removes sensitive fields and formats data for audit logs
   */
  createAuditSnapshot(data: any, sensitiveFields: string[] = []): Record<string, any> {
    const snapshot = { ...data };
    
    // Remove sensitive fields
    sensitiveFields.forEach(field => {
      delete snapshot[field];
    });

    // Remove system fields that don't need auditing
    delete snapshot.createdAt;
    delete snapshot.updatedAt;
    delete snapshot.deletedAt;

    // Convert dates to ISO strings for consistent storage
    Object.keys(snapshot).forEach(key => {
      if (snapshot[key] instanceof Date) {
        snapshot[key] = snapshot[key].toISOString();
      }
    });

    return snapshot;
  }

  /**
   * Compare two objects and return only the changed fields
   * Useful for UPDATE operations to log only what actually changed
   */
  getChangedFields(oldData: any, newData: any): { old: any; new: any } {
    const changedOld: any = {};
    const changedNew: any = {};

    Object.keys(newData).forEach(key => {
      if (oldData[key] !== newData[key]) {
        changedOld[key] = oldData[key];
        changedNew[key] = newData[key];
      }
    });

    return {
      old: Object.keys(changedOld).length > 0 ? changedOld : null,
      new: Object.keys(changedNew).length > 0 ? changedNew : null,
    };
  }
}
