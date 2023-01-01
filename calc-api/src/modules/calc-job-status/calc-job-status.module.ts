import { Module } from '@nestjs/common';
import { CalcJobStatusProjection } from './calc-job-status.projection';

@Module({
  providers: [CalcJobStatusProjection],
})
export class CalcJobStatusModule {}
