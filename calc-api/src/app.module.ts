import { Module } from '@nestjs/common';
import { CalcJobStatusModule } from './modules/calc-job-status/calc-job-status.module';
import { CalcJobModule } from './modules/calc-job/calc-job.module';
import { EventStoreModule } from './modules/eventstore/eventstore.module';
import { EventStoreProvider } from './modules/eventstore/eventstore.provider';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PrismaService } from './modules/prisma/prisma.service';

@Module({
  imports: [CalcJobModule, CalcJobStatusModule, EventStoreModule, PrismaModule],
  providers: [PrismaService, EventStoreProvider],
})
export class AppModule {}
