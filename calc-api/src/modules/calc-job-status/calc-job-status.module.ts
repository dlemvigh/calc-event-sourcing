import { Module } from '@nestjs/common';
import { EventStoreModule } from '../../common/eventstore/eventstore.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CalcJobStatusProjection } from './calc-job-status.projection';
import { CalcJobStatusResolver } from './calc-job-status.resolver';

@Module({
  imports: [PrismaModule, EventStoreModule],
  providers: [CalcJobStatusProjection, CalcJobStatusResolver],
})
export class CalcJobStatusModule {}
