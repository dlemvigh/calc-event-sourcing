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
import { CalcJobStatus } from '@prisma/client';
import { IsNumber } from 'class-validator';
import { v4 as uuid, NIL } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';

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

export class CalcJobStatusViewModel implements CalcJobStatus {
  @ApiProperty({ example: NIL })
  id: string;

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
  @ApiOkResponse({ type: [CalcJobStatusViewModel] })
  async getJobs() {
    return this.prisma.calcJobStatus.findMany();
  }

  @Get('/job/:id')
  @ApiOkResponse({ type: [CalcJobStatusViewModel] })
  async getJob(@Param('id', ParseUUIDPipe) id: string) {
    return `TODO - get job status ${id}`;
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
}
