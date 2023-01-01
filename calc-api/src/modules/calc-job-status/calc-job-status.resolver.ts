import { ParseUUIDPipe } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CalcJobStatusModel } from './calc-job-status.model';

@Resolver(() => CalcJobStatusModel)
export class CalcJobStatusResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => CalcJobStatusModel)
  async status(@Args('id', ParseUUIDPipe) id: string) {
    return this.prisma.calcJobStatus.findUnique({ where: { id } });
  }

  @Query(() => [CalcJobStatusModel])
  async statuses() {
    return this.prisma.calcJobStatus.findMany();
  }
}
