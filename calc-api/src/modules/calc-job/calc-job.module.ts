import { Module } from '@nestjs/common';
import { CalcJobController } from './calc-job.controller';
import { EventStoreProvider } from '../eventstore/eventstore.provider';
import { CalcJobService } from './calc-job.service';

@Module({
  controllers: [CalcJobController],
  providers: [CalcJobService],
})
export class CalcJobModule {}
