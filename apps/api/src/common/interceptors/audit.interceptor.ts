import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditService, AuditContext, AuditLogEntry } from '../../modules/audit/audit.service';

// Decorator to mark methods that should be audited
export const AUDIT_METADATA_KEY = 'audit';
export const Auditable = (entityType: string, action?: string) =>
  Reflect.defineMetadata(AUDIT_METADATA_KEY, { entityType, action }, Reflect);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMetadata = this.reflector.get<{ entityType: string; action?: string }>(
      AUDIT_METADATA_KEY,
      context.getHandler(),
    );

    // Skip if method is not marked for auditing
    if (!auditMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { user, body, params } = request;

    // Skip if no user context (shouldn't happen with auth guards)
    if (!user) {
      return next.handle();
    }

    const auditContext: AuditContext = {
      tenantId: user.tenantId,
      userId: user.userId,
      ipAddress: request.ip,
      userAgent: request.get('User-Agent'),
    };

    return next.handle().pipe(
      tap(async (result) => {
        try {
          const auditEntry = this.createAuditEntry(
            auditMetadata,
            body,
            params,
            result,
          );

          if (auditEntry) {
            await this.auditService.logEvent(auditContext, auditEntry);
          }
        } catch (error) {
          // Audit logging should not fail the main operation
          console.error('Audit interceptor error:', error);
        }
      }),
    );
  }

  private createAuditEntry(
    metadata: { entityType: string; action?: string },
    body: any,
    params: any,
    result: any,
  ): AuditLogEntry | null {
    const { entityType, action } = metadata;

    // Determine action from HTTP method if not specified
    let auditAction = action;
    if (!auditAction) {
      // This would be set based on the HTTP method or controller method name
      auditAction = 'UPDATE'; // Default fallback
    }

    // Determine entity ID from params or result
    const entityId = params?.id || result?.id;
    if (!entityId) {
      return null; // Can't audit without entity ID
    }

    // Create audit entry based on action
    const auditEntry: AuditLogEntry = {
      entityType,
      entityId,
      action: auditAction as any,
    };

    switch (auditAction) {
      case 'CREATE':
        auditEntry.newValues = this.sanitizeData(result);
        break;
      case 'UPDATE':
        auditEntry.newValues = this.sanitizeData(body);
        // Note: For proper UPDATE auditing, we'd need the old values
        // This would require fetching the entity before update
        break;
      case 'DELETE':
        auditEntry.oldValues = this.sanitizeData(result);
        break;
    }

    return auditEntry;
  }

  private sanitizeData(data: any): Record<string, any> | null {
    if (!data) return null;

    const sanitized = { ...data };

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    sensitiveFields.forEach(field => {
      delete sanitized[field];
    });

    // Remove system fields
    delete sanitized.createdAt;
    delete sanitized.updatedAt;
    delete sanitized.deletedAt;

    return Object.keys(sanitized).length > 0 ? sanitized : null;
  }
}
