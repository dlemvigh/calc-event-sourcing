import { ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CalcJobResult } from '@prisma/client';
import { v4 as uuid } from 'uuid';

import { CalcJobModel } from './calc-job.model';
import { CalcJobService } from './calc-job.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CalcJobStatusModel } from '../calc-job-status/calc-job-status.model';

@Resolver(() => CalcJobModel)
export class CalcJobResolver {
  constructor(
    private readonly calcJobService: CalcJobService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => CalcJobModel)
  async job(@Args('id', ParseUUIDPipe) id: string): Promise<CalcJobModel> {
    const result = await this.prisma.calcJobResult.findUnique({
      where: { id },
    });
    return this.mapResult(result);
  }

  @Query(() => [CalcJobModel])
  async jobs() {
    const results = await this.prisma.calcJobResult.findMany();
    return results.map(this.mapResult);
  }

  private mapResult(result: CalcJobResult): CalcJobModel {
    return {
      id: result.id,
      input: Number(result.input),
      output: result.output && Number(result.output),
    };
  }

  @ResolveField(() => CalcJobStatusModel)
  async status(@Parent() job: CalcJobModel): Promise<CalcJobStatusModel> {
    return this.prisma.calcJobStatus.findUnique({ where: { id: job.id } });
  }

  @Mutation(() => CalcJobModel)
  async createJob(
    @Args('input', ParseIntPipe) input: number,
  ): Promise<CalcJobModel> {
    const jobId = uuid();
    const createdAt = new Date();
    const job = await this.calcJobService.createJob(jobId, input, createdAt);

    return {
      id: job.jobId,
      input: job.input,
    };
  }
}
