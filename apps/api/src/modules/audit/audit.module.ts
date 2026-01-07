import { Global, Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';

@Global()
@Module({
  providers: [AuditService],
  controllers: [AuditController],
  exports: [AuditService], // Make available globally for other modules
})
export class AuditModule {}
