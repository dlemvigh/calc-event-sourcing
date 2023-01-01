import { Module } from '@nestjs/common';
import { EventStoreModule } from '../../common/eventstore/eventstore.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CalcJobController } from './calc-job.controller';
import { CalcJobService } from './calc-job.service';

@Module({
  imports: [PrismaModule, EventStoreModule],
  controllers: [CalcJobController],
  providers: [CalcJobService],
})
export class CalcJobModule {}
