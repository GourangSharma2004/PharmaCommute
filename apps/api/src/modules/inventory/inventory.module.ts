import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService], // Export for use in other modules (e.g., recalls, quality)
})
export class InventoryModule {}
