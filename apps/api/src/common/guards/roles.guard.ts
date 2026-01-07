import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles specified, allow access
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.userRecord; // Set by TenantGuard

    if (!user) {
      throw new ForbiddenException('User information not available');
    }

    // Check if user has any of the required roles
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. User role: ${user.role}`
      );
    }

    return true;
  }
}

/**
 * Pharma-specific role hierarchy and permissions
 * 
 * ADMIN: Full system access
 * QA_MANAGER: Quality oversight, batch release, audit access
 * QA_ANALYST: Quality testing, cannot approve releases
 * WAREHOUSE_MANAGER: Inventory management, movement oversight
 * WAREHOUSE_USER: Basic inventory operations
 * PROCUREMENT_USER: Purchase orders, supplier management
 * SALES_USER: Sales orders, customer management
 * AUDITOR: Read-only access to all audit trails and reports
 * 
 * Key principles:
 * - Segregation of duties: QA cannot manage inventory directly
 * - Approval hierarchy: Analysts cannot approve their own work
 * - Audit access: Only specific roles can access audit trails
 * - Tenant isolation: All permissions are within tenant boundary
 */
