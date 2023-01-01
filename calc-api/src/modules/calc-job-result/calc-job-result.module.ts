import { Module } from '@nestjs/common';
import { CalcJobResultProjection } from './calc-job-result.projection';

@Module({
  providers: [CalcJobResultProjection],
})
export class CalcJobResultModule {}
