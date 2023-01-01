import { Module } from '@nestjs/common';
import { EventStoreModule } from '../../common/eventstore/eventstore.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CalcJobController } from './calc-job.controller';
import { CalcJobResolver } from './calc-job.resolver';
import { CalcJobService } from './calc-job.service';

@Module({
  imports: [PrismaModule, EventStoreModule],
  controllers: [CalcJobController],
  providers: [CalcJobService, CalcJobResolver],
})
export class CalcJobModule {}
