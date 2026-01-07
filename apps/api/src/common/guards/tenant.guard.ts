import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Verify tenant exists and is active
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: user.tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
    });

    if (!tenant) {
      throw new ForbiddenException('Tenant not found or inactive');
    }

    // Verify user belongs to tenant and is active
    const userRecord = await this.prisma.user.findFirst({
      where: {
        id: user.userId,
        tenantId: user.tenantId,
        status: 'ACTIVE',
        deletedAt: null,
      },
    });

    if (!userRecord) {
      throw new ForbiddenException('User not found or inactive');
    }

    // Add tenant and user info to request for use in controllers
    request.tenant = tenant;
    request.userRecord = userRecord;

    return true;
  }
}
