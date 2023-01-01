import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { CalcJobResult, CalcJobStatus } from '@prisma/client';
import { IsNumber } from 'class-validator';
import { v4 as uuid, NIL } from 'uuid';
import { PrismaService } from '../../common/prisma/prisma.service';

import { CalcJobService } from './calc-job.service';

export class CreateJobRequestBody {
  @ApiProperty({ example: 5 })
  @IsNumber()
  input: number;
}

export class CreateJobResponseBody {
  @ApiProperty({ example: NIL })
  id: string;

  @ApiProperty({ example: 5 })
  input: number;

  @ApiProperty({ example: new Date(0).toISOString() })
  createdAt: Date;
}

export class CalcJobViewModel {
  @ApiProperty({ example: NIL })
  id: string;

  @ApiProperty({ example: 5 })
  input: number;

  @ApiProperty({ example: 120 })
  output: number;

  @ApiProperty({ example: new Date(0).toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date(0).toISOString() })
  startedAt: Date;

  @ApiProperty({ example: new Date(0).toISOString() })
  finishedAt: Date;
}

@Controller()
@ApiTags('Calculation job')
export class CalcJobController {
  constructor(
    private readonly calcJobService: CalcJobService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('/job')
  @ApiOkResponse({ type: [CalcJobViewModel] })
  async getJobs() {
    const results = await this.prisma.$queryRaw<CalcJobViewModel[]>`
      SELECT *
      FROM "CalcJobResult" result
      LEFT JOIN "CalcJobStatus" status ON result.id = status.id      
    `;

    return results.map((result) => ({
      ...result,
      input: Number(result.input),
      output: Number(result.output),
    }));
  }

  @Get('/job/:id')
  @ApiOkResponse({ type: CalcJobViewModel })
  async getJob(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CalcJobViewModel> {
    const [result, status] = await Promise.all([
      this.prisma.calcJobResult.findUnique({ where: { id } }),
      this.prisma.calcJobStatus.findUnique({ where: { id } }),
    ]);

    const model = this.toCalcJobViewModel(result, status);

    return model;
  }

  private toCalcJobViewModel(
    result: CalcJobResult,
    status: CalcJobStatus,
  ): CalcJobViewModel {
    return {
      id: result.id,
      input: Number(result.input),
      output: Number(result.output),
      createdAt: status.createdAt,
      startedAt: status.startedAt,
      finishedAt: status.finishedAt,
    };
  }

  @Post('/job')
  @ApiCreatedResponse({ type: CreateJobResponseBody })
  async createJob(
    @Body() { input }: CreateJobRequestBody,
  ): Promise<CreateJobResponseBody> {
    const jobId = uuid();
    const createdAt = new Date();

    const event = await this.calcJobService.createJob(jobId, input, createdAt);

    return {
      id: event.jobId,
      input: event.input,
      createdAt: event.createdAt,
    };
  }

  // @Post('job/:id/retry')
  // async retryJob(@Param('id', ParseUUIDPipe) id: string) {
  //   const retryAt = new Date();

  //   const event = await this.calcJobService.retryJob(id, retryAt);

  //   return {
  //     id: event.jobId,
  //     retryAt: event.retryAt,
  //   };
  // }
}
