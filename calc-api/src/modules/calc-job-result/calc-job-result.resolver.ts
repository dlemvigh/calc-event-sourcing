import { ParseUUIDPipe } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CalcJobResult } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CalcJobStatusModel } from '../calc-job-status/calc-job-status.model';
import { CalcJobResultModel } from './calc-job-result.model';

@Resolver(() => CalcJobResultModel)
export class CalcJobResultResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => CalcJobResultModel)
  async result(@Args('id', ParseUUIDPipe) id: string) {
    const result = await this.prisma.calcJobResult.findUnique({
      where: { id },
    });
    return this.mapResult(result);
  }

  @Query(() => [CalcJobResultModel])
  async results() {
    const results = await this.prisma.calcJobResult.findMany();
    return results.map(this.mapResult);
  }

  @ResolveField(() => CalcJobStatusModel)
  async status(@Parent() result: CalcJobResultModel) {
    const { id } = result;
    return this.prisma.calcJobStatus.findUnique({ where: { id } });
  }

  private mapResult(result: CalcJobResult): CalcJobResultModel {
    return {
      ...result,
      input: Number(result.input),
      output: Number(result.output),
    };
  }
}
