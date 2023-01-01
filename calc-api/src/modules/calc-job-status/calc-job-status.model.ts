import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CalcJobStatus } from '@prisma/client';

@ObjectType({ description: 'Calculation result' })
export class CalcJobStatusModel implements CalcJobStatus {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  startedAt: Date;

  @Field({ nullable: true })
  finishedAt: Date;
}
