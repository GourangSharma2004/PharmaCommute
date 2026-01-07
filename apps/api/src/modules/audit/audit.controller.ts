import { 
  Controller, 
  Get, 
  Query, 
  Param, 
  Request,
  ParseDatePipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Audit')
@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('entity/:entityType/:entityId')
  @Roles(UserRole.ADMIN, UserRole.AUDITOR, UserRole.QA_MANAGER)
  @ApiOperation({ 
    summary: 'Get audit trail for specific entity',
    description: 'Returns complete audit history for regulatory compliance'
  })
  @ApiResponse({ status: 200, description: 'Audit trail retrieved successfully' })
  async getEntityAuditTrail(
    @Request() req: any,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ) {
    const { tenantId } = req.user;
    return this.auditService.getEntityAuditTrail(tenantId, entityType, entityId, limit);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.AUDITOR)
  @ApiOperation({ 
    summary: 'Get user activity audit trail',
    description: 'Shows all actions performed by a specific user'
  })
  @ApiResponse({ status: 200, description: 'User audit trail retrieved successfully' })
  async getUserAuditTrail(
    @Request() req: any,
    @Param('userId') userId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number,
  ) {
    const { tenantId } = req.user;
    
    const from = fromDate ? new Date(fromDate) : undefined;
    const to = toDate ? new Date(toDate) : undefined;
    
    return this.auditService.getUserAuditTrail(tenantId, userId, from, to, limit);
  }

  @Get('compliance-report')
  @Roles(UserRole.ADMIN, UserRole.AUDITOR, UserRole.QA_MANAGER)
  @ApiOperation({ 
    summary: 'Generate compliance audit report',
    description: 'Comprehensive audit report for regulatory submissions'
  })
  @ApiResponse({ status: 200, description: 'Compliance report generated successfully' })
  async getComplianceReport(
    @Request() req: any,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('entityTypes') entityTypes?: string,
  ) {
    const { tenantId } = req.user;
    
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const types = entityTypes ? entityTypes.split(',') : undefined;
    
    return this.auditService.getComplianceAuditReport(tenantId, from, to, types);
  }
}
