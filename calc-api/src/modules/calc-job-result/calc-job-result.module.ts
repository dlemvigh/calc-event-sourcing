import { Module } from '@nestjs/common';
import { EventStoreModule } from '../../common/eventstore/eventstore.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { CalcJobResultProjection } from './calc-job-result.projection';

@Module({
  imports: [PrismaModule, EventStoreModule],
  providers: [CalcJobResultProjection],
})
export class CalcJobResultModule {}
